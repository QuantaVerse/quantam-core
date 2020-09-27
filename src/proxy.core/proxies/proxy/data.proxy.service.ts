import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { StockDataBar } from "../../../common/interfaces/data.interface";
import { ProxyJobLog } from "../../../db/entity/proxy.job.log.entity";
import { StockData } from "../../../db/entity/stock.data.entity";
import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { StockDataService } from "../../../db/service/stock.data.service";
import { StockDataRetrievalJobDto } from "../../dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "../../dto/response/stock-data-retrieval-job-response.dto";
import { JobTypeEnum } from "../../proxy.manager.interface";
import { DataProxyConfig, DataProxyInterface, DataProxyStats, IDataProxyConfig, ProxyAPIStats, ProxyStatus } from "./data.proxy.interface";

@Injectable()
export class DataProxyService implements DataProxyInterface {
    protected PROXY_NAME: string;
    protected API_KEY_NAME: string;
    protected API_KEY: string;
    protected PROXY_CONFIG: IDataProxyConfig;
    protected PROXY_API_STATS: ProxyAPIStats;
    protected _nextProxy: DataProxyInterface = null;
    proxyJobLogService: ProxyJobLogService;
    stockDataService: StockDataService;

    constructor(proxyJobLogService: ProxyJobLogService, stockDataService: StockDataService) {
        this.PROXY_CONFIG = new DataProxyConfig();
        this.PROXY_API_STATS = {
            status: ProxyStatus.Unknown,
            api_hit_rate: undefined
        };
        this.proxyJobLogService = proxyJobLogService;
        this.stockDataService = stockDataService;
    }

    getProxyName(): string {
        return this.PROXY_NAME;
    }

    setNextProxy(nextProxy: DataProxyInterface): void {
        Logger.log(`DataProxyService : setting next proxy : ${this.PROXY_NAME} -> ${nextProxy.getProxyName()}`);
        this._nextProxy = nextProxy;
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
        const logsCount: number = proxyJobLogs.length;
        const successfulAPICount = proxyJobLogs.reduce((acc: number, log: ProxyJobLog) => {
            return acc + (log?.responseStatusCode > 0 && log?.responseStatusCode < 300 ? 1 : 0);
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

    @Cron(CronExpression.EVERY_HOUR)
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
                this.proxyJobLogService.createJobLogFromProxyAndJobType(
                    this.PROXY_NAME,
                    JobTypeEnum.HEALTH_CHECK_JOB,
                    error?.config?.url,
                    error?.response?.status,
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

    async retrieveStockData(stockDataRetrievalJobDto: StockDataRetrievalJobDto, jobId: number | null): Promise<StockDataRetrievalJobResponseDto> {
        const message = `DataProxyService : retrieveStockData : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
        Logger.warn(message);
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    async retrieveStockDataViaProxyChain(
        stockDataRetrievalJobDto: StockDataRetrievalJobDto,
        jobId: number | null
    ): Promise<StockDataRetrievalJobResponseDto | HttpException> {
        try {
            Logger.log(
                `DataProxyService : retrieveStockDataViaProxyChain : stockDataRetrievalJobDto=${JSON.stringify(
                    stockDataRetrievalJobDto
                )} jobId=${jobId}`
            );
            return await this.retrieveStockData(stockDataRetrievalJobDto, jobId);
        } catch (exception) {
            await this.proxyJobLogService.updateProxyJobLog(jobId, this.PROXY_NAME, null, HttpStatus.CONTINUE, exception.toString());
            Logger.log(`DataProxyService : retrieveStockDataViaProxyChain : ${exception}`);
        }
        if (this._nextProxy != null) {
            const nextProxyName = this._nextProxy.getProxyName();
            Logger.log(
                `DataProxyService : retrieveStockDataViaProxyChain : trying to retrieve from next proxy in chain : nextProxy='${nextProxyName}'`
            );
            const jobDtoWithNextProxy = new StockDataRetrievalJobDto(
                stockDataRetrievalJobDto.symbol,
                stockDataRetrievalJobDto.exchange,
                stockDataRetrievalJobDto.interval,
                stockDataRetrievalJobDto.fromDate,
                stockDataRetrievalJobDto.toDate,
                stockDataRetrievalJobDto.referrer,
                nextProxyName
            );
            const result = await this.proxyJobLogService.createJobLogFromStockDataRetrievalJobDto(jobDtoWithNextProxy);
            const nextJobId: number | null = result?.identifiers?.length ? result.identifiers[0]?.id : null;
            await this._nextProxy.retrieveStockDataViaProxyChain(jobDtoWithNextProxy, nextJobId);
        } else {
            Logger.log(`DataProxyService : retrieveStockDataViaProxyChain : Data not found in proxy chain!`);
            throw new HttpException("Data not found in proxy chain!", HttpStatus.NOT_FOUND);
        }
    }

    async saveStockDataToDb(symbol: string, exchange: string, interval: number, data: StockDataBar[]): Promise<void> {
        Logger.log(
            `DataProxyService : saveStockDataToDb: symbol=${symbol} exchange=${exchange} interval=${interval} StockDataBarLength=${data.length}`
        );
        data.forEach((d) => {
            const stockData: StockData = new StockData(
                symbol,
                exchange,
                interval,
                d.Timestamp,
                d.Open,
                d.Close,
                d.High,
                d.Low,
                d.Volume,
                this.PROXY_NAME
            );
            this.stockDataService.upsert(stockData);
        });
    }
}
