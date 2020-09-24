import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { ProxyJobLog } from "../../../db/entity/proxy.job.log.entity";
import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { StockDataRetrievalJobDto } from "../../dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "../../dto/response/stock-data-retrieval-job-response.dto";
import { JobTypeEnum } from "../../proxy.manager.interface";
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

    async getProxyStats(): Promise<DataProxyStats> {
        const proxyAPIStats: ProxyAPIStats = await this.fetchAPIStats();
        return {
            name: this.PROXY_NAME,
            api_key_name: this.API_KEY_NAME,
            proxy_config: this.PROXY_CONFIG,
            api_stats: proxyAPIStats
        };
    }

    async fetchAPIStats(): Promise<ProxyAPIStats> {
        const proxyJobLogs: ProxyJobLog[] = await this.proxyJobLogService.findLatestProxyLogs(this.PROXY_NAME);
        const logsCount = proxyJobLogs.length;
        const successfulAPICount = proxyJobLogs.reduce((acc, log) => {
            return acc + (log?.responseStatusCode >= 200 && log?.responseStatusCode < 300 ? 1 : 0);
        }, 0);
        let hitRate: number | null = null;
        let proxyStatus: ProxyStatus = ProxyStatus.Unknown;
        if (logsCount > 0) {
            hitRate = (successfulAPICount * 100) / logsCount;
            if (hitRate >= 100) {
                proxyStatus = ProxyStatus.Sunny;
            } else if (hitRate >= 75) {
                proxyStatus = ProxyStatus.Cloudy;
            } else if (hitRate >= 25) {
                proxyStatus = ProxyStatus.Raining;
            } else if (hitRate > 0) {
                proxyStatus = ProxyStatus.ThunderStorm;
            } else if (hitRate <= 0) {
                proxyStatus = ProxyStatus.Eclipse;
            }
        }
        return {
            status: proxyStatus,
            api_hit_rate: hitRate
        };
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async proxyHealthCheckScheduler(): Promise<any> {
        return await this.pingProxyHealth()
            .then((response) => {
                if (this.PROXY_NAME !== undefined) {
                    if (response != null) {
                        Logger.log(`DataProxyService : pingProxyHealth for '${this.PROXY_NAME}': response found`);
                    }
                    this.proxyJobLogService.createJobLogFromProxyAndJobType(
                        this.PROXY_NAME,
                        JobTypeEnum.HEALTH_CHECK_JOB,
                        response?.config?.url,
                        response?.status,
                        response?.data ? "UP!" : null
                    );
                }
            })
            .catch((error) => {
                Logger.error(`DataProxyService : pingProxyHealth for '${this.PROXY_NAME}': error`, error);
                // TODO: test this flow
                this.proxyJobLogService.createJobLogFromProxyAndJobType(
                    this.PROXY_NAME,
                    JobTypeEnum.HEALTH_CHECK_JOB,
                    error?.config?.url,
                    error?.status,
                    error?.message?.toString()
                );
            });
    }

    async pingProxyHealth(): Promise<any> {
        if (this.PROXY_NAME !== undefined) {
            const message = `DataProxyService : pingProxyHealth : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
            Logger.warn(message);
        }
        return null;
    }

    async retrieveStockData(stockDataRetrievalJobDto: StockDataRetrievalJobDto): Promise<StockDataRetrievalJobResponseDto> {
        const message = `DataProxyService : retrieveStockData : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
        Logger.warn(message);
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
}
