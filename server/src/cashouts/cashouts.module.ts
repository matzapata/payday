import { Module } from '@nestjs/common';
import { CashoutsController } from './cashouts.controller';

@Module({
  controllers: [CashoutsController]
})
export class CashoutsModule {}
