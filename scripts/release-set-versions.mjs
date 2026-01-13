#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const version = process.env.RELEASE_VERSION;

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
	console.error('Error: Missing or invalid RELEASE_VERSION (expected X.Y.Z or X.Y.Z-prerelease)');
	process.exit(1);
}

const packagesDir = path.join(root, 'packages');
const packageDirNames = fs.readdirSync(packagesDir, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name);

const packageFilePaths = packageDirNames
	.map((name) => path.join(packagesDir, name, 'package.json'))
	.filter((p) => fs.existsSync(p));

const workspacePackages = packageFilePaths.map((p) => {
	const json = JSON.parse(fs.readFileSync(p, 'utf8'));

	if (json.private) {
		return null;
	}

	if (!json.name) {
		throw new Error(`Missing "name" in ${p}`);
	}

	return { path: p, dir: path.dirname(p), json };
}).filter((p) => p !== null);

// Map of workspace package names for internal dependency detection
const names = new Set(workspacePackages.map((p) => p.json.name));

function bumpDependencies(block) {
	if (!block) {
		return block;
	}

	for (const dependencyName of Object.keys(block)) {
		if (names.has(dependencyName) && block[dependencyName] === "*") {
			block[dependencyName] = `^${version}`;
		}
	}

	return block;
}

for (const pkg of workspacePackages) {
	pkg.json.version = version;
	pkg.json.dependencies = bumpDependencies(pkg.json.dependencies);
	pkg.json.devDependencies = bumpDependencies(pkg.json.devDependencies);
	pkg.json.peerDependencies = bumpDependencies(pkg.json.peerDependencies);
	pkg.json.optionalDependencies = bumpDependencies(pkg.json.optionalDependencies);

	fs.writeFileSync(pkg.path, JSON.stringify(pkg.json, null, '\t') + '\n');
	console.log(`Updated ${pkg.json.name} -> ${version}`);
}

console.log('Finished updating packages');
