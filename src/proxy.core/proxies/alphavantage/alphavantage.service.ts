import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DailyBar, IntraDayBar } from "../../../common/interfaces/data.interface";
import { StockData } from "../../../db/entity/stock.data.entity";
import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { StockDataService } from "../../../db/service/stock.data.service";
import { StockDataRetrievalJobDto } from "../../dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "../../dto/response/stock-data-retrieval-job-response.dto";
import { DataProxyInterface } from "../proxy/data.proxy.interface";
import { DataProxyService } from "../proxy/data.proxy.service";
import { AlphaVantageAPI } from "./alphavantage.api";
import { AlphavantageProxyConfig, DataType, IAlphavantageAPI, OutputSize } from "./alphavantage.interface";

@Injectable()
export class AlphaVantageService extends DataProxyService implements DataProxyInterface {
    private readonly _alphaVantageAPI: IAlphavantageAPI;
    private readonly ALPHA_PROXY_CONFIG;

    constructor(private configService: ConfigService, private stockDataService: StockDataService, proxyJobLogService: ProxyJobLogService) {
        super(proxyJobLogService);
        this.PROXY_NAME = "AlphaVantage";
        this.API_KEY_NAME = "PROXY_APIKEY_ALPHA_VANTAGE";
        this.API_KEY = this.configService.get<string>(this.API_KEY_NAME);

        this.ALPHA_PROXY_CONFIG = new AlphavantageProxyConfig(DataType.CSV, OutputSize.Full);
        this.PROXY_CONFIG = this.ALPHA_PROXY_CONFIG;

        this._alphaVantageAPI = new AlphaVantageAPI(
            proxyJobLogService,
            this.API_KEY,
            this.ALPHA_PROXY_CONFIG.preferredDataType,
            this.ALPHA_PROXY_CONFIG.preferredOutputSize,
            true
        );
    }

    async pingProxyHealth(): Promise<any> {
        return await this._alphaVantageAPI.getHealth();
    }

    async retrieveStockData(
        stockDataRetrievalJobDto: StockDataRetrievalJobDto,
        jobId: number | null
    ): Promise<StockDataRetrievalJobResponseDto> {
        if (stockDataRetrievalJobDto.interval >= 1440) {
            return await this.retrieveDailyData(stockDataRetrievalJobDto, jobId);
        } else {
            return await this.retrieveIntraDayData(stockDataRetrievalJobDto, jobId);
        }
    }

    async retrieveIntraDayData(
        stockDataRetrievalJobDto: StockDataRetrievalJobDto,
        jobId: number | null
    ): Promise<StockDataRetrievalJobResponseDto> {
        // TODO: Use jobId to update the job status
        Logger.log(`AlphaVantageService : retrieveIntraDayData: stockDataRetrievalJobDto=${stockDataRetrievalJobDto} jobId=${jobId}`);
        const interval: number = stockDataRetrievalJobDto.interval;
        await this._alphaVantageAPI
            .getIntraDayData(stockDataRetrievalJobDto.symbol, stockDataRetrievalJobDto.exchange, `${interval}min`)
            .then((data: IntraDayBar[]) => {
                Logger.log("AlphaVantageService : retrieveIntraDayData: success");
                this.saveIntraDayDataToDb(stockDataRetrievalJobDto.symbol, stockDataRetrievalJobDto.exchange, interval, data)
                    .then(() => {
                        Logger.log("AlphaVantageService : saveIntraDayDataToDb: success");
                    })
                    .catch((error) => {
                        Logger.log("AlphaVantageService : saveIntraDayDataToDb: failed", error);
                    });
            })
            .catch((error) => {
                if (error.toString().startsWith("Error:")) {
                    Logger.warn("AlphaVantageService : retrieveIntraDayData: error", error);
                    throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
                } else {
                    Logger.error("AlphaVantageService : retrieveIntraDayData: error", error);
                    throw new HttpException(error.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        return new StockDataRetrievalJobResponseDto("001");
    }

    async saveIntraDayDataToDb(symbol: string, exchange: string, interval: number, data: IntraDayBar[]): Promise<void> {
        Logger.log(
            `AlphaVantageService : saveIntraDayDataToDb: symbol=${symbol} interval=${interval} IntraDayBarArrayLength=${data.length}`
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

    async retrieveDailyData(
        stockDataRetrievalJobDto: StockDataRetrievalJobDto,
        jobId: number | null
    ): Promise<StockDataRetrievalJobResponseDto> {
        // TODO: Use jobId to update the job status
        Logger.log(`AlphaVantageService : retrieveDailyData: stockDataRetrievalJobDto=${stockDataRetrievalJobDto} jobId=${jobId}`);
        const interval: number = stockDataRetrievalJobDto.interval;
        await this._alphaVantageAPI
            .getDailyData(stockDataRetrievalJobDto.symbol, stockDataRetrievalJobDto.exchange, `${interval}min`)
            .then((data: DailyBar[]) => {
                Logger.log("AlphaVantageService : retrieveDailyData: success");
                this.saveDailyDataToDb(stockDataRetrievalJobDto.symbol, stockDataRetrievalJobDto.exchange, interval, data)
                    .then(() => {
                        Logger.log("AlphaVantageService : saveDailyDataToDb: success");
                    })
                    .catch((error) => {
                        Logger.log("AlphaVantageService : saveDailyDataToDb: failed", error);
                    });
            })
            .catch((error) => {
                if (error.toString().startsWith("Error:")) {
                    Logger.warn("AlphaVantageService : retrieveDailyData: error", error);
                    throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
                } else {
                    Logger.error("AlphaVantageService : retrieveDailyData: error", error);
                    throw new HttpException(error.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        return new StockDataRetrievalJobResponseDto("001");
    }

    async saveDailyDataToDb(symbol: string, exchange: string, interval: number, data: DailyBar[]): Promise<void> {
        Logger.log(`AlphaVantageService : saveDailyDataToDb: symbol=${symbol} interval=${interval} DailyBarArrayLength=${data.length}`);
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
