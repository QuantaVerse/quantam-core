import { Controller, Get } from "@nestjs/common";

import { QuantamCoreService } from "./quantam.core.service";

/**
 * QuantamCoreController is an injectable instance made for QuantamCoreModule
 *
 * APIs available:
 *
 *      /GET health
 *
 */
@Controller("")
export class QuantamCoreController {
    constructor(private readonly coreService: QuantamCoreService) {}

    /**
     * Health api for Quantam Core module
     * Used for fetching current status of the module
     *
     * @return {Record<string, string>}
     */
    @Get("health")
    getHealth(): Record<string, string> {
        return this.coreService.getQuantamCoreStatus();
    }
}
