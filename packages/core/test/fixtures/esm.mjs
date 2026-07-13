import { createRequire } from 'node:module';

import { Injectable, Module } from '@nestjs/common';
import { NestApplicationContext } from '@nestjs/core';
import { Forge, ForgeBaseComponent, ForgeExtension, ForgeModule, ForgeService } from '@nest-forge/core';

const require = createRequire(import.meta.url);
const requiredForge = require('@nest-forge/core');
const requiredNest = require('@nestjs/core');

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

const app = await Forge.createApplicationContext(FixtureModule, {
	extensions: [FixtureExtension],
	logger: false,
});

const result = {
	booted,
	componentIdentity: ForgeBaseComponent === requiredForge.ForgeBaseComponent,
	forgeIdentity: Forge === requiredForge.Forge,
	nestIdentity: NestApplicationContext === requiredNest.NestApplicationContext,
	serviceResolved: app.get(FixtureService) instanceof FixtureService,
};

await app.close();
process.stdout.write(JSON.stringify(result));
