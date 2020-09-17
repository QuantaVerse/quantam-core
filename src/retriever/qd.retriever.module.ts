import { Module } from "@nestjs/common";

import { ProxyManagerService } from "../proxy/proxy.manager.service";
import { QuantamDataRetrieverController } from "./qd.retriever.controller";
import { QuantamDataRetrieverService } from "./qd.retriever.service";

@Module({
    imports: [],
    controllers: [QuantamDataRetrieverController],
    providers: [QuantamDataRetrieverService, ProxyManagerService]
})
export class QuantamDataRetrieverModule {}
