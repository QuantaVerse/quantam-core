import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { DataRetrieverJobDto } from "../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "./proxies/dto/response/data-retriever-job-response.dto";
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

    @Post("createJob")
    pullDataFromProxy(@Body() dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto {
        return this.proxyManagerService.createDataRetrieverJob(dataRetrieverJobDto);
    }
}
