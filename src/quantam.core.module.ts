import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ProxyManagerModule } from "./proxy.core/proxy.manager.module";
import { QuantamCoreController } from "./quantam.core.controller";
import { QuantamCoreService } from "./quantam.core.service";
import { QuantamDataRetrieverModule } from "./retriever/qd.retriever.module";

@Module({
    imports: [
        QuantamDataRetrieverModule,
        ProxyManagerModule,
        ConfigModule.forRoot({
            isGlobal: true
        })
    ],
    controllers: [QuantamCoreController],
    providers: [QuantamCoreService]
})
export class QuantamCoreModule {}
