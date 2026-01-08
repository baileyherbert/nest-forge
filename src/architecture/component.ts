export abstract class ForgeBaseComponent {
	protected onModuleInit(): any {}
	protected onApplicationBootstrap(): any {}
	protected onModuleDestroy(signal: string): any {}
	protected beforeApplicationShutdown(signal: string): any {}
	protected onApplicationShutdown(signal: string): any {}
}
