import { Controller, Get, Logger } from "@nestjs/common";

import { QuantamCoreService } from "./quantam.core.service";

/**
 * QuantamCoreController is an injectable instance made for QuantamCoreModule
 *
 * APIs available:
 * 1. /GET health
 *
 */
@Controller("")
export class QuantamCoreController {
    constructor(private readonly coreService: QuantamCoreService) {}

    /**
     * API Endpoint for checking health of Quantam Core module
     * Used for fetching current status of the module
     *
     * @return {Record<string, string>}
     */
    @Get("health")
    getHealth(): Record<string, string> {
        Logger.log(`QuantamCoreController : getHealth`);
        return this.coreService.getQuantamCoreStatus();
    }
}
