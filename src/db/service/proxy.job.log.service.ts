import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotEquals } from "class-validator";
import { FindConditions, Repository, UpdateResult } from "typeorm";
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
                proxy: proxyName,
                responseStatusCode: NotEquals(null)
            },
            order: {
                updatedAt: -1
            },
            take: 20
        });
    }

    async findProxyJobLogById(jobId: number): Promise<ProxyJobLog> {
        return await this.proxyJobLogRepository.findOne(jobId);
    }

    async findProxyJobLogsByParams(
        proxyName: string | null,
        jobType: string | null,
        responseStatusCode: number | null,
        limit: number
    ): Promise<ProxyJobLog[]> {
        const searchParams: FindConditions<ProxyJobLog> = {};
        if (proxyName != null) {
            searchParams.proxy = proxyName;
        }
        if (jobType != null) {
            searchParams.jobType = jobType;
        }
        if (responseStatusCode != null) {
            searchParams.responseStatusCode = responseStatusCode;
        }
        return await this.proxyJobLogRepository.find({
            where: searchParams,
            order: {
                updatedAt: -1
            },
            take: limit
        });
    }

    async updateProxyJobLog(jobId: number, proxyName: string, url: string, responseStatusCode: number, message: string): Promise<UpdateResult> {
        return await this.proxyJobLogRepository.update(jobId, {
            proxy: proxyName,
            api: url,
            responseStatusCode: responseStatusCode,
            message: message
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
