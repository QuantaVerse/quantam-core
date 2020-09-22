import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InsertResult } from "typeorm/query-builder/result/InsertResult";

import { ProxyApiLog } from "../entity/proxy.api.log.entity";

@Injectable()
export class ProxyApiLogService {
    constructor(
        @InjectRepository(ProxyApiLog)
        private proxyApiLogRepository: Repository<ProxyApiLog>
    ) {}

    async create(proxyApiLog: ProxyApiLog): Promise<InsertResult> {
        return await this.proxyApiLogRepository.insert(proxyApiLog);
    }

    async findByProxyName(proxyName: string): Promise<ProxyApiLog[]> {
        return await this.proxyApiLogRepository.find({
            where: {
                proxyName: proxyName
            },
            order: {
                logCreationTime: -1
            },
            take: 20
        });
    }
}
