import { Module } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";

import { StockDataModule } from "../db/module/stock.data.module";
import { ProxyManagerModule } from "../proxy.core/proxy.manager.module";
import { QuantamDataRetrieverController } from "./qd.retriever.controller";
import { QuantamDataRetrieverService } from "./qd.retriever.service";

export const qd_retriever_module_metadata: ModuleMetadata = {
    imports: [ProxyManagerModule, StockDataModule],
    controllers: [QuantamDataRetrieverController],
    providers: [QuantamDataRetrieverService]
};

/**
 * @module QuantamDataRetrieverModule
 * This module is imported in the QuantamCoreModule
 *
 *
 * ModuleMetadata:
 *
 * imports: [ProxyManagerModule, StockDataModule]
 *
 * controllers: [QuantamDataRetrieverController]
 *
 * providers: [QuantamDataRetrieverService]
 */
@Module(qd_retriever_module_metadata)
export class QuantamDataRetrieverModule {}
