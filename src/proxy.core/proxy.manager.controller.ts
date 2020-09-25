import { Body, Controller, Get, HttpException, Logger, Param, Post } from "@nestjs/common";

import { StockDataRetrievalJobDto } from "./dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "./dto/response/stock-data-retrieval-job-response.dto";
import { DataProxyStats } from "./proxies/proxy/data.proxy.interface";
import { ProxyManagerService } from "./proxy.manager.service";

/**
 * ProxyManagerController is an injectable instance made for QuantamCoreModule
 *
 * API path prefix: proxy_manager
 *
 * APIs available:
 * 1. /GET stats
 * 2. /GET stats/:name
 * 3. /POST createJob : @body StockDataRetrievalJobDto
 *
 */
@Controller("proxy_manager")
export class ProxyManagerController {
    constructor(private readonly proxyManagerService: ProxyManagerService) {}

    /**
     * API Endpoint for fetching proxyStats of all registered proxies
     *
     * @returns Promise<Record<string, DataProxyStats>>
     */
    @Get(["stats"])
    async getProxies(): Promise<Record<string, DataProxyStats>> {
        Logger.log(`ProxyManagerController : getProxies`);
        return await this.proxyManagerService.getProxies();
    }

    /**
     * API Endpoint for fetching proxyStats of one registered proxy
     *
     * @param {string} name - Name of the proxy
     *
     * @returns Promise<DataProxyStats | HttpException>
     */
    @Get("stats/:name")
    async getProxyDetails(@Param("name") name: string): Promise<DataProxyStats | HttpException> {
        Logger.log(`ProxyManagerController : getProxyDetails name='${name}'`);
        return await this.proxyManagerService.getProxyDetails(`${name}`);
    }

    /**
     * API Endpoint for creating a StockDataRetrievalJob for proxyManager
     *
     * @param {StockDataRetrievalJobDto} stockDataRetrievalJobDto
     *
     * @returns Promise<StockDataRetrievalJobResponseDto | HttpException>
     */
    @Post("createJob")
    async pullDataFromProxy(
        @Body() stockDataRetrievalJobDto: StockDataRetrievalJobDto
    ): Promise<StockDataRetrievalJobResponseDto | HttpException> {
        Logger.log(`ProxyManagerController : pullDataFromProxy : stockDataRetrievalJobDto = ${JSON.stringify(stockDataRetrievalJobDto)}`);
        return await this.proxyManagerService.createStockDataRetrievalJob(stockDataRetrievalJobDto);
    }

    // TODO: jobs apis
    // @Get("job/:jobId")
    // getJobStats(@Param("jobId") jobId: string): Promise<ProxyJobLog> {
    //
    // }
}
