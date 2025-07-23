import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const SwaggerConfigInit = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API for user management')
    .setVersion('0.0.1')
    .addBearerAuth(SwaggerAuthConfig(), 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);
};

export const SwaggerAuthConfig = (): SecuritySchemeObject => {
  return {
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
    name: 'Authorization',
  };
};
