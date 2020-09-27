import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IntervalEnum } from "../common/interfaces/data.interface";
import { ProxyJobLog } from "../db/entity/proxy.job.log.entity";
import { ProxyJobLogService } from "../db/service/proxy.job.log.service";
import { StockDataRetrievalJobDto } from "./dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "./dto/response/stock-data-retrieval-job-response.dto";
import { AlphaVantageService } from "./proxies/alphavantage/alphavantage.service";
import { KiteService } from "./proxies/kite/kite.service";
import { MarketStackService } from "./proxies/marketstack/marketstack.service";
import { DataProxyInterface, DataProxyStats } from "./proxies/proxy/data.proxy.interface";
import { ProxyManagerInterface } from "./proxy.manager.interface";

@Injectable()
export class ProxyManagerService implements ProxyManagerInterface {
    private readonly _proxyServices: Record<string, DataProxyInterface>;
    private readonly _proxyChain: string[];
    private readonly _defaultProxy: DataProxyInterface = null;

    constructor(
        private configService: ConfigService,
        private proxyJobLogService: ProxyJobLogService,
        private alphaVantageService: AlphaVantageService,
        private kiteService: KiteService,
        private marketStackService: MarketStackService
    ) {
        this._proxyServices = {
            alphavantage: alphaVantageService,
            kite: kiteService,
            marketstack: marketStackService
        };

        this._proxyChain = this.configService.get<string>("PROXY_PREFERENCE").split(",");
        Logger.log(`ProxyManagerService : constructor : configuring proxyChain : ${this._proxyChain}`);

        let lastProxy: DataProxyInterface = null;
        if (this._proxyChain.length === 0) {
            Logger.error(
                `ProxyManagerService : constructor : Invalid proxy chain config! Proxy chain is empty! this._proxyChain = ${this._proxyChain}`
            );
            throw Error("Invalid proxy chain config! Proxy chain is empty!");
        }
        for (const proxyName of this._proxyChain) {
            if (proxyName in this._proxyServices) {
                if (lastProxy === null) {
                    this._defaultProxy = this._proxyServices[proxyName];
                } else {
                    lastProxy.setNextProxy(this._proxyServices[proxyName]);
                }
                lastProxy = this._proxyServices[proxyName];
            } else {
                Logger.error(
                    `ProxyManagerService : constructor : Invalid proxy chain config! Proxy with '${proxyName}' not found! this._proxyChain = ${this._proxyChain}`
                );
                throw Error(`Invalid proxy chain config! Proxy with '${proxyName}' not found!`);
            }
        }
    }

    /**
     * @method getProxies
     *
     * @returns Promise<Record<string, DataProxyStats>>
     */
    async getProxies(): Promise<Record<string, DataProxyStats>> {
        Logger.log(`ProxyManagerService : getProxies`);
        const proxyStats: Record<string, DataProxyStats> = {};
        for (const proxyName in this._proxyServices) {
            if (this._proxyServices.hasOwnProperty(proxyName)) {
                proxyStats[proxyName] = await this._proxyServices[proxyName].getProxyStats();
            }
        }
        return proxyStats;
    }

    /**
     * @method getProxyDetails
     *
     * @param {string} proxyName
     *
     * @returns Promise<DataProxyStats | HttpException>
     */
    async getProxyDetails(proxyName: string): Promise<DataProxyStats | HttpException> {
        Logger.log(`ProxyManagerService : getProxyDetails for proxy with name='${proxyName}'`);
        if (this._proxyServices.hasOwnProperty(proxyName.toLowerCase())) {
            return await this._proxyServices[proxyName.toLowerCase()].getProxyStats();
        } else {
            const message = `ProxyManagerService : getProxyDetails : Proxy with name '${proxyName.toLowerCase()}' not found`;
            Logger.warn(`getProxyDetails : ${message} : HttpStatus.BAD_REQUEST`);
            throw new HttpException(message, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @method createStockDataRetrievalJob
     *
     * Steps:
     *
     * 1. Validate `proxyName` if mentioned in `stockDataRetrievalJobDto`.
     * When `proxyName` is mentioned, this method will use strategy pattern.
     * 2. If validation failed or `proxyName` is not mentioned, get a Proxy based on config and preference.
     * When `proxyName` is not mentioned, this method will use chain of responsibility pattern.
     * 3. Validate `interval` if mentioned in `stockDataRetrievalJobDto`.
     * 4. retrieveStockData based on selected Proxy
     *
     * @param {StockDataRetrievalJobDto} jobDto
     *
     * @returns Promise<StockDataRetrievalJobResponseDto | HttpException>
     */
    async createStockDataRetrievalJob(jobDto: StockDataRetrievalJobDto): Promise<StockDataRetrievalJobResponseDto | HttpException> {
        Logger.log(`ProxyManagerService : createStockDataRetrievalJob : stockDataRetrievalJobDto ${JSON.stringify(jobDto)}`);

        let proxyName: string | undefined = jobDto.proxy?.toLowerCase();
        let useProxyChain = false;
        if (typeof proxyName === "string" && !this._proxyServices.hasOwnProperty(proxyName)) {
            Logger.warn("ProxyManagerService : createStockDataRetrievalJob : Proxy not found : HttpStatus.BAD_REQUEST");
            throw new HttpException("Proxy not found", HttpStatus.BAD_REQUEST);
        } else if (proxyName === undefined) {
            proxyName = this._defaultProxy.getProxyName().toLowerCase();
            useProxyChain = true;
        }

        const jobDtoWithProxy = new StockDataRetrievalJobDto(
            jobDto.symbol,
            jobDto.exchange,
            jobDto.interval,
            jobDto.fromDate,
            jobDto.toDate,
            jobDto.referrer,
            proxyName
        );
        const result = await this.proxyJobLogService.createJobLogFromStockDataRetrievalJobDto(jobDtoWithProxy);
        const jobId: number | null = result?.identifiers?.length ? result.identifiers[0]?.id : null;

        const interval: IntervalEnum | undefined = jobDto.interval;
        if (interval !== undefined) {
            if (useProxyChain) {
                return await this._proxyServices[proxyName].retrieveStockDataViaProxyChain(jobDtoWithProxy, jobId);
            } else {
                return await this._proxyServices[proxyName].retrieveStockData(jobDtoWithProxy, jobId);
            }
        } else {
            Logger.warn("ProxyManagerService : createStockDataRetrievalJob : Given interval is invalid : HttpStatus.BAD_REQUEST");
            throw new HttpException("Given interval is invalid", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @method getJobDataById
     *
     * @param {number} jobId
     *
     * @returns Promise<ProxyJobLog>
     */
    async getJobDataById(jobId: number): Promise<ProxyJobLog> {
        Logger.log(`ProxyManagerService : getJobDataById : jobId = ${jobId}`);
        return await this.proxyJobLogService.findProxyJobLogById(jobId);
    }

    /**
     * @method searchProxyJobLogs
     *
     * @param {string | null} proxyName
     * @param {string | null} jobType
     * @param {number | null} responseStatusCode
     * @param {number} limit
     *
     * @returns Promise<ProxyJobLog[]>
     */
    async searchProxyJobLogs(
        proxyName: string | null,
        jobType: string | null,
        responseStatusCode: number | null,
        limit: number
    ): Promise<ProxyJobLog[]> {
        Logger.log(
            `ProxyManagerService : searchProxyJobLogs : proxy = ${proxyName} jobType = ${jobType} responseStatusCode = ${responseStatusCode} limit=${limit}`
        );
        return await this.proxyJobLogService.findProxyJobLogsByParams(proxyName, jobType, responseStatusCode, limit);
    }
}
