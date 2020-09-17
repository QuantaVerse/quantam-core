import { Controller, Get } from '@nestjs/common';
import { QuantamCoreService } from './quantam.core.service';

@Controller("")
export class QuantamCoreController {
    constructor(private readonly coreService: QuantamCoreService) {}

    @Get("health")
    getHealth(): Record<string, string> {
        return this.coreService.getQuantamCoreStatus();
    }
}
