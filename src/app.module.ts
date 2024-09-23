import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import { winstonOptions } from './logging/logger';

@Module({
  imports: [WinstonModule.forRoot(winstonOptions)],
  controllers: [],
  providers: [],
})
export class AppModule {}
