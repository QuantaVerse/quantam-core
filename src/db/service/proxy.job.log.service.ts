import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InsertResult } from "typeorm/query-builder/result/InsertResult";

import { DataRetrievalJobDto } from "../../proxy.core/dto/request/data-retrieval-job.dto";
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

    async findByProxyName(proxyName: string): Promise<ProxyJobLog[]> {
        return await this.proxyJobLogRepository.find({
            where: {
                proxyUsed: proxyName
            },
            order: {
                createdAt: -1
            },
            take: 20
        });
    }

    async createJobLogFromDataRetrievalJobDto(dataRetrieverJobDto: DataRetrievalJobDto) {
        const proxyJobLog: ProxyJobLog = new ProxyJobLog(
            dataRetrieverJobDto.symbol,
            dataRetrieverJobDto.exchange,
            dataRetrieverJobDto.interval,
            dataRetrieverJobDto.fromDate,
            dataRetrieverJobDto.toDate,
            dataRetrieverJobDto.proxy
        );
        await this.create(proxyJobLog);
    }
}
