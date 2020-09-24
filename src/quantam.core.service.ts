import { Injectable, Logger } from "@nestjs/common";

/**
 * QuantamCoreService is an injectable instance made for QuantamCoreModule
 */
@Injectable()
export class QuantamCoreService {
    getQuantamCoreStatus(): Record<string, string> {
        Logger.log(`QuantamCoreService : getQuantamCoreStatus`);
        return {
            status: "OK",
            message: "Quantam Core is up!"
        };
    }
}
