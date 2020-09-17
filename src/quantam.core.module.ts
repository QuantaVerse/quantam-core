import { Module } from '@nestjs/common';
import {QuantamDataRetrieverModule} from "./retriever/qd.retriever.module";
import {QuantamCoreController} from "./quantam.core.controller";
import {QuantamCoreService} from "./quantam.core.service";

@Module({
    imports: [QuantamDataRetrieverModule],
    controllers: [QuantamCoreController],
    providers: [QuantamCoreService]
})
export class QuantamCoreModule {}
