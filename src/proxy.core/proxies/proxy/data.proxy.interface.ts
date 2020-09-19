import { DataRetrieverJobDto } from "../../../retriever/dto/request/data-retriever-job.dto";
import { DataProxyStats } from "./data.proxy.stats";

export interface DataProxyInterface {
    getProxyStats(): DataProxyStats;

    retrieveIntraDayData(dataRetrieverJobDto: DataRetrieverJobDto): void;
}
