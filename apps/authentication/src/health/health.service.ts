import { Injectable } from '@nestjs/common';

const version = process.env.APP_VERSION || '0.0.1';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      version,
      timestamp: new Date().toISOString(),
    };
  }
}
