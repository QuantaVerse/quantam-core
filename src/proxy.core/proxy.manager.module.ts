import { Module } from "@nestjs/common";
import { ModuleMetadata } from "@nestjs/common/interfaces/modules/module-metadata.interface";

import { KiteService } from "./proxies/kite/kite.service";
import { MarketStackService } from "./proxies/marketstack/marketstack.service";
import { ProxyManagerController } from "./proxy.manager.controller";
import { ProxyManagerService } from "./proxy.manager.service";

export const proxy_manager_module_metadata: ModuleMetadata = {
    imports: [],
    controllers: [ProxyManagerController],
    providers: [ProxyManagerService, MarketStackService, KiteService],
    exports: [ProxyManagerService]
};

@Module(proxy_manager_module_metadata)
export class ProxyManagerModule {}
