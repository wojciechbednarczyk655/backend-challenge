import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EControllerNames } from '../common/enums/controller-name.enum';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller(EControllerNames.Health)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns service status, uptime, version, and timestamp.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service health status',
    schema: {
      example: {
        status: 'ok',
        uptime: 123.45,
        version: '0.0.1',
        timestamp: '2025-07-23T18:03:11.575Z',
      },
    },
  })
  getHealth() {
    return this.healthService.getHealth();
  }
}
