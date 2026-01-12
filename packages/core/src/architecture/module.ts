import { MiddlewareConsumer } from '@nestjs/common';
import { ForgeBaseComponent } from './component';

export abstract class ForgeModule extends ForgeBaseComponent {
	public configure(consumer: MiddlewareConsumer): any {}
}
