import { Module } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProxyManagerModule } from "./proxy.core/proxy.manager.module";
import { QuantamCoreController } from "./quantam.core.controller";
import { QuantamCoreService } from "./quantam.core.service";
import { QuantamDataRetrieverModule } from "./retriever/qd.retriever.module";

export const quantam_core_module_metadata: ModuleMetadata = {
    imports: [
        QuantamDataRetrieverModule,
        ProxyManagerModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "quantam_admin",
            password: "password",
            database: "quantam",
            entities: [],
            synchronize: true
        })
    ],
    controllers: [QuantamCoreController],
    providers: [QuantamCoreService]
};

@Module(quantam_core_module_metadata)
export class QuantamCoreModule {}
