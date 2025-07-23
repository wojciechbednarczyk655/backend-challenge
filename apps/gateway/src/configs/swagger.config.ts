import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfigInit = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API for user management')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);
};
