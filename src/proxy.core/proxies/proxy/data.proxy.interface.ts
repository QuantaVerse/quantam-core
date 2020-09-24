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
    readonly proxy_config: Record<string, string>;
    readonly api_stats: ProxyAPIStats;
}

/**
 * @interface DataProxyInterface
 * Used as the service interface for DataProxyService
 */
export interface DataProxyInterface {
    getProxyStats(): Promise<DataProxyStats>;
    fetchAPIStats(): void;
    proxyHealthCheckScheduler(): Promise<any>;
    pingProxyHealth(): Promise<any>;
    retrieveStockData(stockDataRetrievalJobDto: StockDataRetrievalJobDto, jobId: number | null): Promise<StockDataRetrievalJobResponseDto>;
}
