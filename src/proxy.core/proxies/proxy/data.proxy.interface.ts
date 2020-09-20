import { DataRetrieverJobDto } from "../../../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "../../../retriever/dto/response/data-retriever-job-response.dto";
import { IntraDayBar } from "../alphavantage/alphavantage.api";
import { DataProxyStats } from "./data.proxy.stats";

export interface DataProxyInterface {
    getProxyStats(): DataProxyStats;
    retrieveIntraDayData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto;
    saveIntraDayDataToDb(symbol: string, interval: number, data: IntraDayBar[]): Promise<void>;
}
