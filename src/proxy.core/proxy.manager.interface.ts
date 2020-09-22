import { HttpException } from "@nestjs/common";

import { DataRetrievalJobDto } from "./proxies/dto/request/data-retrieval-job.dto";
import { DataRetrieverJobResponseDto } from "./proxies/dto/response/data-retriever-job-response.dto";
import { DataProxyStats } from "./proxies/proxy/data.proxy.interface";

export interface ProxyManagerInterface {
    createDataRetrievalJob(
        dataRetrieverJobDto: DataRetrievalJobDto
    ): Promise<DataRetrieverJobResponseDto | HttpException>;
    getProxies(): Record<string, DataProxyStats>;
    getProxyDetails(proxyName: string): DataProxyStats;
}
