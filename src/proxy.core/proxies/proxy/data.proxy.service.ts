import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { DataRetrievalJobDto } from "../../dto/request/data-retrieval-job.dto";
import { DataRetrievalJobResponseDto } from "../../dto/response/data-retrieval-job-response.dto";
import { DataProxyInterface, DataProxyStats, ProxyAPIStats, ProxyStatus } from "./data.proxy.interface";

@Injectable()
export class DataProxyService implements DataProxyInterface {
    protected PROXY_NAME: string;
    protected API_KEY_NAME: string;
    protected API_KEY: string;
    protected PROXY_CONFIG: Record<string, string>;
    protected PROXY_API_STATS: ProxyAPIStats;

    constructor() {
        this.PROXY_CONFIG = {};
        this.PROXY_API_STATS = {
            status: ProxyStatus.Unknown,
            api_hit_rate: undefined
        };
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
        // TODO: implement
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

    async retrieveStockData(dataRetrieverJobDto: DataRetrievalJobDto): Promise<DataRetrievalJobResponseDto> {
        const message = `DataProxyService : retrieveStockData : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
        Logger.warn(message);
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
}
