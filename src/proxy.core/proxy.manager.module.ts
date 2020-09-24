import { Module } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";
import { ConfigService } from "@nestjs/config";

import { ProxyJobLogModule } from "../db/module/proxy.job.log.module";
import { StockDataModule } from "../db/module/stock.data.module";
import { AlphaVantageService } from "./proxies/alphavantage/alphavantage.service";
import { KiteService } from "./proxies/kite/kite.service";
import { MarketStackService } from "./proxies/marketstack/marketstack.service";
import { DataProxyService } from "./proxies/proxy/data.proxy.service";
import { ProxyManagerController } from "./proxy.manager.controller";
import { ProxyManagerService } from "./proxy.manager.service";

export const proxy_manager_module_metadata: ModuleMetadata = {
    imports: [StockDataModule, ProxyJobLogModule],
    controllers: [ProxyManagerController],
    providers: [ConfigService, ProxyManagerService, MarketStackService, KiteService, AlphaVantageService, DataProxyService],
    exports: [ProxyManagerService]
};

/**
 * @module ProxyManagerModule
 * This module is imported in the QuantamCoreModule
 *
 *
 * ModuleMetadata:
 *
 * imports: [StockDataModule, ProxyJobLogModule]
 *
 * controllers: [ProxyManagerController]
 *
 * providers: [ConfigService, ProxyManagerService, MarketStackService, KiteService, AlphaVantageService, DataProxyService]
 *
 * exports: [ProxyManagerService]
 */
@Module(proxy_manager_module_metadata)
export class ProxyManagerModule {}
