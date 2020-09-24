import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { ProxyJobLog } from "../../../db/entity/proxy.job.log.entity";
import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { StockDataRetrievalJobDto } from "../../dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "../../dto/response/stock-data-retrieval-job-response.dto";
import { DataProxyInterface, DataProxyStats, ProxyAPIStats, ProxyStatus } from "./data.proxy.interface";

@Injectable()
export class DataProxyService implements DataProxyInterface {
    protected PROXY_NAME: string;
    protected API_KEY_NAME: string;
    protected API_KEY: string;
    protected PROXY_CONFIG: Record<string, string>;
    protected PROXY_API_STATS: ProxyAPIStats;
    proxyJobLogService: ProxyJobLogService;

    constructor(proxyJobLogService: ProxyJobLogService) {
        this.PROXY_CONFIG = {};
        this.PROXY_API_STATS = {
            status: ProxyStatus.Unknown,
            api_hit_rate: undefined
        };
        this.proxyJobLogService = proxyJobLogService;
    }

    getProxyStats(): DataProxyStats {
        return {
            name: this.PROXY_NAME,
            api_key_name: this.API_KEY_NAME,
            proxy_config: this.PROXY_CONFIG,
            api_stats: this.PROXY_API_STATS
        };
    }

    async fetchAPIStats(): Promise<ProxyAPIStats> {
        const proxyJobLogs: ProxyJobLog[] = await this.proxyJobLogService.findLatestProxyLogs(this.PROXY_NAME);
        return;
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    proxyHealthCheckScheduler(): void {
        this.pingProxyHealth();
    }

    pingProxyHealth(): void {
        if (this.PROXY_NAME !== undefined) {
            const message = `DataProxyService : pingProxyHealth : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
            Logger.warn(message);
        }
    }

    async retrieveStockData(stockDataRetrievalJobDto: StockDataRetrievalJobDto): Promise<StockDataRetrievalJobResponseDto> {
        const message = `DataProxyService : retrieveStockData : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
        Logger.warn(message);
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
}
