import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();
  private readonly version: string;

  constructor(private readonly configService: ConfigService) {
    this.version = this.configService.get<string>('APP_VERSION', '0.0.1');
  }

  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      version: this.version,
      timestamp: new Date().toISOString(),
    };
  }
}
