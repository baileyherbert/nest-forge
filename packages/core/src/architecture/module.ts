import { MiddlewareConsumer } from '@nestjs/common';
import { ForgeBaseComponent } from './component.js';

export abstract class ForgeModule extends ForgeBaseComponent {
	public configure(consumer: MiddlewareConsumer): any {}
}
