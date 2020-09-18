import { Module } from "@nestjs/common";

import { KiteService } from "./proxies/kite/kite.service";
import { MarketStackService } from "./proxies/marketstack/marketstack.service";
import { ProxyManagerController } from "./proxy.manager.controller";
import { ProxyManagerService } from "./proxy.manager.service";

@Module({
    imports: [],
    controllers: [ProxyManagerController],
    providers: [ProxyManagerService, MarketStackService, KiteService],
    exports: [ProxyManagerService]
})
export class ProxyManagerModule {}
