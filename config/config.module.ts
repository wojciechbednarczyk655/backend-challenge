import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        AUTH_MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        GATEWAY_PORT: Joi.number().default(3000),
        AUTH_PORT: Joi.number().default(3001),
      }),
    }),
  ],
  providers: [],
  exports: [NestConfigModule],
})
export class ConfigModule {}
