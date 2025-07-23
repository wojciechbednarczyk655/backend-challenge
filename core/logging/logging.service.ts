import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService extends Logger {
  log(message: string) {
    super.log(message);
  }
}
