import { Body, Controller, Get, HttpException, Logger, Param, Post } from "@nestjs/common";

import { DataRetrievalJobDto } from "./dto/request/data-retrieval-job.dto";
import { DataRetrievalJobResponseDto } from "./dto/response/data-retrieval-job-response.dto";
import { DataProxyStats } from "./proxies/proxy/data.proxy.interface";
import { ProxyManagerService } from "./proxy.manager.service";

@Controller("proxy_manager")
export class ProxyManagerController {
    constructor(private readonly proxyManagerService: ProxyManagerService) {}

    @Get(["stats"])
    getProxies(): Record<string, DataProxyStats> {
        Logger.log(`ProxyManagerController : getProxies`);
        return this.proxyManagerService.getProxies();
    }

    @Get("stats/:name")
    getProxyDetails(@Param("name") name: string): DataProxyStats {
        Logger.log(`ProxyManagerController : getProxyDetails name='${name}'`);
        return this.proxyManagerService.getProxyDetails(`${name}`);
    }

    @Post("createJob")
    pullDataFromProxy(@Body() dataRetrieverJobDto: DataRetrievalJobDto): Promise<DataRetrievalJobResponseDto | HttpException> {
        Logger.log(`ProxyManagerController : pullDataFromProxy : dataRetrieverJobDto = ${JSON.stringify(dataRetrieverJobDto)}`);
        return this.proxyManagerService.createDataRetrievalJob(dataRetrieverJobDto);
    }

    // TODO: jobs apis
    // @Get("job/:jobId")
    // getJobStats(@Param("jobId") jobId: string): Promise<ProxyJobLog> {
    //
    // }
}
