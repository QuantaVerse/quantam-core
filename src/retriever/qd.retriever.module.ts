import { Module } from "@nestjs/common";
import { QuantamDataRetrieverService } from "./qd.retriever.service";
import { QuantamDataRetrieverController } from "./qd.retriever.controller";

@Module({
    imports: [],
    controllers: [QuantamDataRetrieverController],
    providers: [QuantamDataRetrieverService]
})
export class QuantamDataRetrieverModule {}
