import { Injectable } from "@nestjs/common";

/**
 * QuantamCoreService is an injectable instance made for QuantamCoreModule
 */
@Injectable()
export class QuantamCoreService {
    getQuantamCoreStatus(): Record<string, string> {
        return {
            status: "OK",
            message: "Quantam Core is up!"
        };
    }
}
