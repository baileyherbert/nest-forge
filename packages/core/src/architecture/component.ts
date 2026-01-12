import { Inject } from '@nestjs/common';
import { FORGE_FIELD_MODULE_REF } from '../constants';
import { ModuleRef } from '@nestjs/core';

export abstract class ForgeBaseComponent {
	/**
	 * @internal
	 */
	@Inject(ModuleRef)
	public [FORGE_FIELD_MODULE_REF]: ModuleRef;

	protected onModuleInit(): any {}
	protected onApplicationBootstrap(): any {}
	protected onModuleDestroy(signal: string): any {}
	protected beforeApplicationShutdown(signal: string): any {}
	protected onApplicationShutdown(signal: string): any {}
}
