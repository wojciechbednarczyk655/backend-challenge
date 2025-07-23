import { Module } from '@nestjs/common';
import { ConfigModule } from '../../../config';
import { AuthModule } from './auth/auth.module';
import { LoggingModule } from '../../../core/logging/logging.module';

@Module({
  imports: [ConfigModule, LoggingModule, AuthModule],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
