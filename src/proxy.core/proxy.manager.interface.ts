import { HttpException } from "@nestjs/common";

import { DataRetrievalJobDto } from "./dto/request/data-retrieval-job.dto";
import { DataRetrievalJobResponseDto } from "./dto/response/data-retrieval-job-response.dto";
import { DataProxyStats } from "./proxies/proxy/data.proxy.interface";

export interface ProxyManagerInterface {
    getProxies(): Record<string, DataProxyStats>;
    getProxyDetails(proxyName: string): DataProxyStats;
    createDataRetrievalJob(
        dataRetrieverJobDto: DataRetrievalJobDto
    ): Promise<DataRetrievalJobResponseDto | HttpException>;
}
