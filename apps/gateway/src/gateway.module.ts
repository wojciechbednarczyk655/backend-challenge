import { Module } from '@nestjs/common';

import { ConfigModule } from '@config/index';
import { LoggingModule } from '@core/logging/logging.module';

import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ConfigModule, LoggingModule, AuthModule, HealthModule],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
