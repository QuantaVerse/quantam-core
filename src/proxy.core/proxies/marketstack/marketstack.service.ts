import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IntervalEnum, StockDataBar } from "../../../common/interfaces/data.interface";
import { ProxyJobLog } from "../../../db/entity/proxy.job.log.entity";
import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { StockDataService } from "../../../db/service/stock.data.service";
import { StockDataRetrievalJobDto } from "../../dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "../../dto/response/stock-data-retrieval-job-response.dto";
import { DataProxyInterface } from "../proxy/data.proxy.interface";
import { DataProxyService } from "../proxy/data.proxy.service";
import { MarketStackAPI } from "./marketstack.api";
import { IMarketStackAPI, MarketStackConfig, marketStackExchange, marketStackInterval } from "./marketstack.interface";

@Injectable()
export class MarketStackService extends DataProxyService implements DataProxyInterface {
    private readonly _marketStackAPI: IMarketStackAPI;
    private readonly MARKET_STACK_CONFIG;

    constructor(private configService: ConfigService, proxyJobLogService: ProxyJobLogService, stockDataService: StockDataService) {
        super(proxyJobLogService, stockDataService);
        this.PROXY_NAME = "MarketStack";
        this.API_KEY_NAME = "PROXY_APIKEY_MARKET_STACK";
        this.API_KEY = this.configService.get<string>(this.API_KEY_NAME);

        this.MARKET_STACK_CONFIG = new MarketStackConfig();
        this.PROXY_CONFIG = this.MARKET_STACK_CONFIG;

        this._marketStackAPI = new MarketStackAPI(proxyJobLogService, this.API_KEY, true);
    }

    async pingProxyHealth(): Promise<any> {
        return await this._marketStackAPI.getHealth();
    }

    async retrieveStockData(stockDataRetrievalJobDto: StockDataRetrievalJobDto, jobId: number | null): Promise<StockDataRetrievalJobResponseDto> {
        Logger.log(`MarketStackService : retrieveStockData: stockDataRetrievalJobDto=${JSON.stringify(stockDataRetrievalJobDto)} jobId=${jobId}`);
        if (this.MARKET_STACK_CONFIG?.openExchanges?.includes(stockDataRetrievalJobDto.exchange)) {
            if (stockDataRetrievalJobDto.interval === IntervalEnum.ONE_DAY) {
                return undefined;
            } else if (this.MARKET_STACK_CONFIG?.intraDayIntervals?.includes(stockDataRetrievalJobDto.interval)) {
                return undefined;
            } else {
                throw new Error(`MarketStackService : retrieveStockData : Invalid interval='${stockDataRetrievalJobDto.interval}'`);
            }
        } else {
            throw new Error(`MarketStackService : retrieveStockData : Invalid exchange='${stockDataRetrievalJobDto.exchange}'`);
        }
    }

    async retrieveIntraDayData(stockDataRetrievalJobDto: StockDataRetrievalJobDto, jobId: number | null): Promise<StockDataRetrievalJobResponseDto> {
        Logger.log(`MarketStackService : retrieveIntraDayData: stockDataRetrievalJobDto=${JSON.stringify(stockDataRetrievalJobDto)} jobId=${jobId}`);
        const interval: number = stockDataRetrievalJobDto.interval;
        const url: string = this._marketStackAPI.getIntraDayDataUrl(
            stockDataRetrievalJobDto.symbol,
            marketStackExchange(stockDataRetrievalJobDto.exchange),
            marketStackInterval(interval)
        );
        await this._marketStackAPI
            .getIntraDayData(stockDataRetrievalJobDto.symbol, marketStackExchange(stockDataRetrievalJobDto.exchange), marketStackInterval(interval))
            .then((data: StockDataBar[]) => {
                Logger.log("MarketStackService : retrieveIntraDayData: success");
                this.saveStockDataToDb(stockDataRetrievalJobDto.symbol, stockDataRetrievalJobDto.exchange, interval, data)
                    .then(() => {
                        Logger.log("MarketStackService : saveIntraDayDataToDb: success");
                    })
                    .catch((error) => {
                        Logger.log("MarketStackService : saveIntraDayDataToDb: failed", error);
                    });
                this.proxyJobLogService.updateProxyJobLog(jobId, this.PROXY_NAME, url, HttpStatus.OK, `DataSize=${data.length}`);
            })
            .catch((error) => {
                if (error.toString().startsWith("Error:")) {
                    Logger.warn("MarketStackService : retrieveIntraDayData: error", error);
                    this.proxyJobLogService.updateProxyJobLog(jobId, this.PROXY_NAME, url, HttpStatus.BAD_REQUEST, error.toString());
                    throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
                } else {
                    Logger.error("MarketStackService : retrieveIntraDayData: error", error);
                    this.proxyJobLogService.updateProxyJobLog(jobId, this.PROXY_NAME, url, HttpStatus.INTERNAL_SERVER_ERROR, error.toString());
                    throw new HttpException(error.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        const proxyJobLog: ProxyJobLog = await this.proxyJobLogService.findProxyJobLogById(jobId);
        return new StockDataRetrievalJobResponseDto(proxyJobLog);
    }

    async retrieveDailyData(stockDataRetrievalJobDto: StockDataRetrievalJobDto, jobId: number | null): Promise<StockDataRetrievalJobResponseDto> {
        Logger.log(`MarketStackService : retrieveDailyData: stockDataRetrievalJobDto=${JSON.stringify(stockDataRetrievalJobDto)} jobId=${jobId}`);
        const interval: number = stockDataRetrievalJobDto.interval;
        const url: string = this._marketStackAPI.getDailyDataUrl(
            stockDataRetrievalJobDto.symbol,
            marketStackExchange(stockDataRetrievalJobDto.exchange),
            marketStackInterval(interval)
        );
        await this._marketStackAPI
            .getDailyData(stockDataRetrievalJobDto.symbol, marketStackExchange(stockDataRetrievalJobDto.exchange), marketStackInterval(interval))
            .then((data: StockDataBar[]) => {
                Logger.log("MarketStackService : retrieveDailyData: success");
                this.saveStockDataToDb(stockDataRetrievalJobDto.symbol, stockDataRetrievalJobDto.exchange, interval, data)
                    .then(() => {
                        Logger.log("MarketStackService : saveDailyDataToDb: success");
                    })
                    .catch((error) => {
                        Logger.log("MarketStackService : saveDailyDataToDb: failed", error);
                    });
                this.proxyJobLogService.updateProxyJobLog(jobId, this.PROXY_NAME, url, HttpStatus.OK, `DataSize=${data.length}`);
            })
            .catch((error) => {
                if (error.toString().startsWith("Error:")) {
                    Logger.warn("MarketStackService : retrieveDailyData: error", error);
                    this.proxyJobLogService.updateProxyJobLog(jobId, this.PROXY_NAME, url, HttpStatus.BAD_REQUEST, error.toString());
                    throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
                } else {
                    Logger.error("MarketStackService : retrieveDailyData: error", error);
                    this.proxyJobLogService.updateProxyJobLog(jobId, this.PROXY_NAME, url, HttpStatus.INTERNAL_SERVER_ERROR, error.toString());
                    throw new HttpException(error.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        const proxyJobLog: ProxyJobLog = await this.proxyJobLogService.findProxyJobLogById(jobId);
        return new StockDataRetrievalJobResponseDto(proxyJobLog);
    }
}
