import { Controller, Get } from '@nestjs/common';

import { HealthService } from './health.service';
import { EControllerNames } from '../common/enums/controller-name.enum';

@Controller(EControllerNames.Health)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth() {
    return this.healthService.getHealth();
  }
}
