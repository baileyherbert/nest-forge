import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);

interface FixtureResult {
	booted: boolean;
	componentIdentity: boolean;
	forgeIdentity: boolean;
	nestIdentity: boolean;
	serviceResolved: boolean;
}

/**
 * Runs a module-format fixture in an untransformed Node process.
 *
 * This ensures package export conditions and Node's module caches are tested
 * directly instead of through Vitest's module loader.
 */
async function runFixture(fileName: string): Promise<FixtureResult> {
	const fixturePath = fileURLToPath(new URL(`./fixtures/${fileName}`, import.meta.url));
	const { stdout } = await execFileAsync(process.execPath, [fixturePath], { timeout: 10_000 });

	return JSON.parse(stdout) as FixtureResult;
}

describe.each([
	['CommonJS', 'commonjs.cjs'],
	['ESM', 'esm.mjs'],
])('%s Nest consumer', (_format, fixture) => {
	it('shares module identity and applies Forge lifecycle hooks', async () => {
		await expect(runFixture(fixture)).resolves.toEqual({
			booted: true,
			componentIdentity: true,
			forgeIdentity: true,
			nestIdentity: true,
			serviceResolved: true,
		});
	});
});
