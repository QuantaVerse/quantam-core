import { Module } from "@nestjs/common";
import { QuantamDataRetrieverService } from "./qd.retriever.service";
import { QuantamDataRetrieverController } from "./qd.retriever.controller";
import { ProxyManagerService } from "../proxy/proxy.manager.service";

@Module({
    imports: [],
    controllers: [QuantamDataRetrieverController],
    providers: [QuantamDataRetrieverService, ProxyManagerService]
})
export class QuantamDataRetrieverModule {}
