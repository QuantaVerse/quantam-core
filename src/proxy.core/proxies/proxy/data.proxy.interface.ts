import { DataRetrieverJobDto } from "../../../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "../../../retriever/dto/response/data-retriever-job-response.dto";

export class DailyBar {
    Timestamp: Date;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
}

export class IntraDayBar {
    Timestamp: Date;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
}

export interface ProxyAPIStats {
    status: boolean;
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
    retrieveIntraDayData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto;
    saveIntraDayDataToDb(symbol: string, interval: number, data: IntraDayBar[]): Promise<void>;
    retrieveDailyData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto;
    saveDailyDataToDb(symbol: string, interval: number, data: DailyBar[]): Promise<void>;
}
