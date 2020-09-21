import { Controller, Get, Param } from "@nestjs/common";

import { DataProxyStats } from "./proxies/proxy/data.proxy.interface";
import { ProxyManagerService } from "./proxy.manager.service";

@Controller("proxy_manager")
export class ProxyManagerController {
    constructor(private readonly proxyManagerService: ProxyManagerService) {}

    @Get(["stats"])
    getProxies(): Record<string, DataProxyStats> {
        return this.proxyManagerService.getProxies();
    }

    @Get("stats/:name")
    getProxyDetails(@Param("name") name: string): DataProxyStats {
        return this.proxyManagerService.getProxyDetails(`${name}`);
    }
}
