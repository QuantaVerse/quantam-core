import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InsertResult } from "typeorm/query-builder/result/InsertResult";

import { StockDataRetrievalJobDto } from "../../proxy.core/dto/request/stock-data-retrieval-job.dto";
import { JobTypeEnum } from "../../proxy.core/proxy.manager.interface";
import { ProxyJobLog } from "../entity/proxy.job.log.entity";

@Injectable()
export class ProxyJobLogService {
    constructor(
        @InjectRepository(ProxyJobLog)
        private proxyJobLogRepository: Repository<ProxyJobLog>
    ) {}

    async create(proxyJobLog: ProxyJobLog): Promise<InsertResult> {
        return await this.proxyJobLogRepository.insert(proxyJobLog);
    }

    async findLatestProxyLogs(proxyName: string): Promise<ProxyJobLog[]> {
        return await this.proxyJobLogRepository.find({
            where: {
                proxy: proxyName
            },
            order: {
                updatedAt: -1
            },
            take: 20
        });
    }

    async createJobLogFromProxyAndJobType(
        proxy: string,
        jobType: JobTypeEnum,
        api: string,
        responseStatusCode: number,
        message: string
    ): Promise<InsertResult> {
        const proxyJobLog: ProxyJobLog = new ProxyJobLog(proxy, jobType, api, responseStatusCode, message);
        return await this.create(proxyJobLog);
    }

    async createJobLogFromStockDataRetrievalJobDto(stockDataRetrievalJobDto: StockDataRetrievalJobDto): Promise<InsertResult> {
        const proxyJobLog: ProxyJobLog = new ProxyJobLog(stockDataRetrievalJobDto.proxy, JobTypeEnum.STOCK_DATA_RETRIEVAL_JOB);
        return await this.create(proxyJobLog);
    }
}
