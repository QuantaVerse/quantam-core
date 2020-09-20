import { DataRetrieverJobDto } from "../../../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "../../../retriever/dto/response/data-retriever-job-response.dto";
import { DataProxyStats } from "./data.proxy.stats";

export class DailyBar {
    Timestamp: Date;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
    AdjClose: number;
    DividendAmount: number;
    SplitCoefficient: number;
}

export class IntraDayBar {
    Timestamp: Date;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
}

export interface DataProxyInterface {
    getProxyStats(): DataProxyStats;
    retrieveIntraDayData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto;
    saveIntraDayDataToDb(symbol: string, interval: number, data: IntraDayBar[]): Promise<void>;
    retrieveDailyData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto;
    saveDailyDataToDb(symbol: string, interval: number, data: DailyBar[]): Promise<void>;
}
