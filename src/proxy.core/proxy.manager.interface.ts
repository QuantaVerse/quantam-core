import { HttpException } from "@nestjs/common";

import { StockDataRetrievalJobDto } from "./dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "./dto/response/stock-data-retrieval-job-response.dto";
import { DataProxyStats } from "./proxies/proxy/data.proxy.interface";

export interface ProxyManagerInterface {
    getProxies(): Record<string, DataProxyStats>;
    getProxyDetails(proxyName: string): DataProxyStats;
    createStockDataRetrievalJob(
        stockDataRetrievalJobDto: StockDataRetrievalJobDto
    ): Promise<StockDataRetrievalJobResponseDto | HttpException>;
}
