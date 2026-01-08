import { Injectable } from '@nestjs/common';
import { ForgeBaseComponent } from './component';

@Injectable()
export abstract class ForgeService extends ForgeBaseComponent {}
