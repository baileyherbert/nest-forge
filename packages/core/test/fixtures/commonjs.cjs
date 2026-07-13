const { Injectable, Module } = require('@nestjs/common');
const requiredNest = require('@nestjs/core');
const requiredForge = require('@nest-forge/core');

const { Forge, ForgeExtension, ForgeModule, ForgeService } = requiredForge;

class FixtureService extends ForgeService {}
Injectable()(FixtureService);

class FixtureModule extends ForgeModule {}
Module({ providers: [FixtureService] })(FixtureModule);

let booted = false;

class FixtureExtension extends ForgeExtension {
	async afterBoot() {
		booted = true;
	}
}

async function run() {
	const importedForge = await import('@nest-forge/core');
	const importedNest = await import('@nestjs/core');
	const app = await Forge.createApplicationContext(FixtureModule, {
		extensions: [FixtureExtension],
		logger: false,
	});

	const result = {
		booted,
		componentIdentity: requiredForge.ForgeBaseComponent === importedForge.ForgeBaseComponent,
		forgeIdentity: requiredForge.Forge === importedForge.Forge,
		nestIdentity: requiredNest.NestApplicationContext === importedNest.NestApplicationContext,
		serviceResolved: app.get(FixtureService) instanceof FixtureService,
	};

	await app.close();
	process.stdout.write(JSON.stringify(result));
}

run().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
