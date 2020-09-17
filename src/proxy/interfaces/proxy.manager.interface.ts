import { CreateRetrieverJobDto } from "../../retriever/dto/request/create-retriever-job.dto";

export interface ProxyManagerInterface {
    createDataRetrieverJob(createRetrieverJobDto: CreateRetrieverJobDto);
    getProxies(): Record<string, Record<string, unknown>>;
    getProxyDetails(proxyName: string): Record<string, unknown>;
}
