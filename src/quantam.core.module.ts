import { Module } from "@nestjs/common";

import { BunyanLoggerModule } from "./logger/logger.module";
import { BunyanLoggerService } from "./logger/logger.service";
import { QuantamCoreController } from "./quantam.core.controller";
import { QuantamCoreService } from "./quantam.core.service";
import { QuantamDataRetrieverModule } from "./retriever/qd.retriever.module";

@Module({
    imports: [QuantamDataRetrieverModule],
    controllers: [QuantamCoreController],
    providers: [QuantamCoreService]
})
export class QuantamCoreModule {}
