import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@config/index';
import { LoggingModule } from '@core/logging/logging.module';

import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    LoggingModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('AUTH_MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthenticationModule {}
