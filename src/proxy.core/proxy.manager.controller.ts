import { Body, Controller, Get, HttpException, Param, Post } from "@nestjs/common";

import { DataRetrievalJobDto } from "./proxies/dto/request/data-retrieval-job.dto";
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
    pullDataFromProxy(
        @Body() dataRetrieverJobDto: DataRetrievalJobDto
    ): Promise<DataRetrieverJobResponseDto | HttpException> {
        return this.proxyManagerService.createDataRetrievalJob(dataRetrieverJobDto);
    }
}
