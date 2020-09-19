import { DataRetrieverJobDto } from "../retriever/dto/request/data-retriever-job.dto";
import { DataProxyStats } from "./proxies/proxy/data.proxy.stats";

export interface ProxyManagerInterface {
    createDataRetrieverJob(dataRetrieverJobDto: DataRetrieverJobDto);
    getProxies(): Record<string, DataProxyStats>;
    getProxyDetails(proxyName: string): DataProxyStats;
}
