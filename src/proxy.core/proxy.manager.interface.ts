import { CreateRetrieverJobDto } from "../retriever/dto/request/create-retriever-job.dto";
import { DataProxyStats } from "./proxies/proxy/data.proxy.stats";

export interface ProxyManagerInterface {
    createDataRetrieverJob(createRetrieverJobDto: CreateRetrieverJobDto);
    getProxies(): Record<string, DataProxyStats>;
    getProxyDetails(proxyName: string): DataProxyStats;
}
