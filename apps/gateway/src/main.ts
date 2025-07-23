import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@config/index';
import { LoggingService } from '@core/logging/logging.service';
import { ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { SwaggerConfigInit } from './configs/swagger.config';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.useGlobalGuards(app.get(ThrottlerGuard));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('GATEWAY_PORT') ?? 3000;
  const logger = app.get(LoggingService);

  SwaggerConfigInit(app);

  await app.listen(port);

  logger.log(`Gateway is running on port ${port}`);
}
bootstrap();
