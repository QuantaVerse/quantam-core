import { DataRetrieverJobDto } from "../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "../retriever/dto/response/data-retriever-job-response.dto";
import { DataProxyStats } from "./proxies/proxy/data.proxy.interface";

export interface ProxyManagerInterface {
    createDataRetrieverJob(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto;
    getProxies(): Record<string, DataProxyStats>;
    getProxyDetails(proxyName: string): DataProxyStats;
}
