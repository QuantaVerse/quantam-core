import { Module } from "@nestjs/common";

import { BunyanLoggerService } from "./logger.service";

@Module({
    providers: [BunyanLoggerService],
    exports: [BunyanLoggerService]
})
export class BunyanLoggerModule {}
