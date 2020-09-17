import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { ProxyManagerService } from "../proxy/proxy.manager.service";
import { CreateRetrieverJobDto } from "./dto/request/create-retriever-job.dto";
import { QuantamDataRetrieverService } from "./qd.retriever.service";

@Controller("retriever")
export class QuantamDataRetrieverController {
    constructor(
        private readonly dataRetrieverService: QuantamDataRetrieverService,
        private readonly proxyManagerService: ProxyManagerService
    ) {}

    @Get("health")
    getHealth(): Record<string, string> {
        return this.dataRetrieverService.getHealth();
    }

    @Get(["proxies", "proxy", "proxies/all"])
    getProxies(): Record<string, Record<string, unknown>> {
        return this.proxyManagerService.getProxies();
    }

    @Get("proxy/:name")
    getProxyDetails(@Param("name") name: string): Record<string, unknown> {
        return this.proxyManagerService.getProxyDetails(`${name}`);
    }

    @Post("createJob")
    pullDataFromProxy(@Body() createRetrieverJobDto: CreateRetrieverJobDto) {
        return this.proxyManagerService.createDataRetrieverJob(createRetrieverJobDto);
    }
}
