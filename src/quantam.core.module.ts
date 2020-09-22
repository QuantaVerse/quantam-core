import { Module } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { ProxyManagerModule } from "./proxy.core/proxy.manager.module";
import { QuantamCoreController } from "./quantam.core.controller";
import { QuantamCoreService } from "./quantam.core.service";
import { QuantamDataRetrieverModule } from "./retriever/qd.retriever.module";

const orm_config: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "quantam_admin",
    password: "password",
    database: "quantam",
    logging: false,
    synchronize: true,
    autoLoadEntities: true,
    entities: [],
    migrations: [],
    subscribers: [],
    cli: {
        entitiesDir: "src/db/entity",
        migrationsDir: "src/db/migration",
        subscribersDir: "src/db/subscriber"
    }
};

export const quantam_core_module_metadata: ModuleMetadata = {
    imports: [
        QuantamDataRetrieverModule,
        ProxyManagerModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot(orm_config),
        ScheduleModule.forRoot()
    ],
    controllers: [QuantamCoreController],
    providers: [QuantamCoreService]
};

/**
 * @module QuantamCoreModule
 * Primary module for the application
 *
 *
 * ModuleMetadata:
 *
 * imports: [QuantamDataRetrieverModule, ProxyManagerModule, ConfigModule, TypeOrmModule, ScheduleModule]
 *
 * controllers: [QuantamCoreController]
 *
 * providers: [QuantamCoreService]
 */
@Module(quantam_core_module_metadata)
export class QuantamCoreModule {}
