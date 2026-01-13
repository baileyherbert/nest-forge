import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagesDir = path.join(root, 'packages');

const pkgJsonPaths = fs
	.readdirSync(packagesDir, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => path.join(packagesDir, d.name, 'package.json'))
	.filter((p) => fs.existsSync(p));

const names = pkgJsonPaths
	.map((p) => {
		const json = JSON.parse(fs.readFileSync(p, 'utf8'));

		if (json.private) {
			return null;
		}

		return json.name;
	})
	.filter(Boolean);

console.log(names.join('\n'));
