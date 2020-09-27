import { HttpException } from "@nestjs/common";

import { ExchangeEnum, IntervalEnum, StockDataBar } from "../../../common/interfaces/data.interface";
import { StockDataRetrievalJobDto } from "../../dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "../../dto/response/stock-data-retrieval-job-response.dto";

/***
 * Defining the status of proxy based on previous API calls
 * Sunny = 100%
 * Cloudy = 75% - 100%
 * Raining = 25% - 75%
 * ThunderStorm = 1% - 25%,
 * Eclipse = 0%
 */
export enum ProxyStatus {
    Sunny = "sunny",
    Cloudy = "cloudy",
    Raining = "raining",
    ThunderStorm = "thunderstorm",
    Eclipse = "eclipse",
    Unknown = "unknown"
}

export interface ProxyAPIStats {
    status: ProxyStatus;
    api_hit_rate: number | null;
}

export interface DataProxyStats {
    readonly name: string;
    readonly api_key_name: string;
    readonly proxy_config: IDataProxyConfig;
    readonly api_stats: ProxyAPIStats;
}

export interface IDataProxyConfig {
    openExchanges: ExchangeEnum[];
    intraDayIntervals: IntervalEnum[];
    additionalConfig: Record<string, string>;
}

export class DataProxyConfig implements IDataProxyConfig {
    intraDayIntervals: IntervalEnum[];
    openExchanges: ExchangeEnum[];
    additionalConfig: Record<string, string>;

    constructor(intraDayIntervals: IntervalEnum[] = [], openExchanges: ExchangeEnum[] = [], additionalConfig: Record<string, string> = {}) {
        this.intraDayIntervals = intraDayIntervals;
        this.openExchanges = openExchanges;
        this.additionalConfig = additionalConfig;
    }
}

/**
 * @interface DataProxyInterface
 * Used as the service interface for DataProxyService
 */
export interface DataProxyInterface {
    getProxyName(): string;
    setNextProxy(nextProxy: DataProxyInterface): void;
    getProxyStats(): Promise<DataProxyStats>;
    fetchAPIStats(): Promise<ProxyAPIStats>;
    proxyHealthCheckScheduler(): Promise<any>;
    pingProxyHealth(): Promise<any>;
    retrieveStockDataViaProxyChain(
        stockDataRetrievalJobDto: StockDataRetrievalJobDto,
        jobId: number | null
    ): Promise<StockDataRetrievalJobResponseDto | HttpException>;
    retrieveStockData(stockDataRetrievalJobDto: StockDataRetrievalJobDto, jobId: number | null): Promise<StockDataRetrievalJobResponseDto>;
    saveStockDataToDb(symbol: string, exchange: string, interval: number, data: StockDataBar[]): Promise<void>;
}
