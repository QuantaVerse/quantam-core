import { DailyBar, IntraDayBar } from "../../../common/interfaces/data.interface";
import { DataRetrievalJobDto } from "../dto/request/data-retrieval-job.dto";
import { DataRetrieverJobResponseDto } from "../dto/response/data-retriever-job-response.dto";

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
    api_hit_rate: number | undefined;
}

export interface DataProxyStats {
    readonly name: string;
    readonly api_key_name: string;
    readonly proxy_config: Record<string, string>;
    readonly api_stats: ProxyAPIStats;
}

export interface DataProxyInterface {
    getProxyStats(): DataProxyStats;
    fetchAPIStats(): void;
    proxyHealthCheckScheduler(): void;
    pingProxyHealth(): void;
    retrieveIntraDayData(dataRetrieverJobDto: DataRetrievalJobDto): Promise<DataRetrieverJobResponseDto>;
    saveIntraDayDataToDb(symbol: string, exchange: string, interval: number, data: IntraDayBar[]): Promise<void>;
    retrieveDailyData(dataRetrieverJobDto: DataRetrievalJobDto): Promise<DataRetrieverJobResponseDto>;
    saveDailyDataToDb(symbol: string, exchange: string, interval: number, data: DailyBar[]): Promise<void>;
}
