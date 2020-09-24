import { Body, Controller, Get, HttpException, Logger, Param, Post } from "@nestjs/common";

import { StockDataRetrievalJobDto } from "./dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "./dto/response/stock-data-retrieval-job-response.dto";
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
    pullDataFromProxy(
        @Body() stockDataRetrievalJobDto: StockDataRetrievalJobDto
    ): Promise<StockDataRetrievalJobResponseDto | HttpException> {
        Logger.log(`ProxyManagerController : pullDataFromProxy : stockDataRetrievalJobDto = ${JSON.stringify(stockDataRetrievalJobDto)}`);
        return this.proxyManagerService.createStockDataRetrievalJob(stockDataRetrievalJobDto);
    }

    // TODO: jobs apis
    // @Get("job/:jobId")
    // getJobStats(@Param("jobId") jobId: string): Promise<ProxyJobLog> {
    //
    // }
}
