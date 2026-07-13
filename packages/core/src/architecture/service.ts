import { Injectable } from '@nestjs/common';
import { ForgeBaseComponent } from './component.js';

@Injectable()
export abstract class ForgeService extends ForgeBaseComponent {}
