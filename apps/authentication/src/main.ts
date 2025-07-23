import { NestFactory } from '@nestjs/core';
import { AuthenticationModule } from './authentication.module';
import { Transport } from '@nestjs/microservices';

import { ConfigService } from '@config/index';
import { LoggingService } from '@core/logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthenticationModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: new ConfigService().get<number>('AUTH_PORT'),
    },
  });
  const logger = app.get(LoggingService);
  const port = new ConfigService().get<number>('AUTH_PORT') ?? 3001;

  await app.listen();

  logger.log(`Authentication microservice is running on port ${port}`);
}
bootstrap();
