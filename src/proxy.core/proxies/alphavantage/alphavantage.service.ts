import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DailyBar, IntraDayBar } from "../../../common/interfaces/data.interface";
import { StockData } from "../../../db/entity/stock.data.entity";
import { StockDataService } from "../../../db/service/stock.data.service";
import { DataRetrievalJobDto } from "../../dto/request/data-retrieval-job.dto";
import { DataRetrievalJobResponseDto } from "../../dto/response/data-retrieval-job-response.dto";
import { DataProxyInterface } from "../proxy/data.proxy.interface";
import { DataProxyService } from "../proxy/data.proxy.service";
import { AlphaVantageAPI } from "./alphavantage.api";
import { AlphavantageProxyConfig, DataType, IAlphavantageAPI, OutputSize } from "./alphavantage.interface";

@Injectable()
export class AlphaVantageService extends DataProxyService implements DataProxyInterface {
    private readonly _alphaVantageAPI: IAlphavantageAPI;
    private readonly ALPHA_PROXY_CONFIG;

    constructor(private configService: ConfigService, private stockDataService: StockDataService) {
        super();
        this.PROXY_NAME = "AlphaVantage";
        this.API_KEY_NAME = "PROXY_APIKEY_ALPHA_VANTAGE";
        this.API_KEY = this.configService.get<string>(this.API_KEY_NAME);

        this.ALPHA_PROXY_CONFIG = new AlphavantageProxyConfig(DataType.CSV, OutputSize.Full);
        this.PROXY_CONFIG = this.ALPHA_PROXY_CONFIG;

        this._alphaVantageAPI = new AlphaVantageAPI(
            this.API_KEY,
            this.ALPHA_PROXY_CONFIG.preferredDataType,
            this.ALPHA_PROXY_CONFIG.preferredOutputSize,
            true
        );
    }

    pingProxyHealth(): void {
        this._alphaVantageAPI
            .getHealth()
            .then(() => {
                Logger.log("AlphaVantageService : pingProxyHealth: pinged");
            })
            .catch((error) => {
                Logger.error("AlphaVantageService : pingProxyHealth: error", error);
            });
    }

    async retrieveStockData(dataRetrievalJobDto: DataRetrievalJobDto): Promise<DataRetrievalJobResponseDto> {
        if (dataRetrievalJobDto.interval >= 1440) {
            return await this.retrieveDailyData(dataRetrievalJobDto);
        } else {
            return await this.retrieveIntraDayData(dataRetrievalJobDto);
        }
    }

    async retrieveIntraDayData(dataRetrievalJobDto: DataRetrievalJobDto): Promise<DataRetrievalJobResponseDto> {
        Logger.log(`AlphaVantageService : retrieveIntraDayData: dataRetrievalJobDto=${dataRetrievalJobDto}`);
        const interval: number = dataRetrievalJobDto.interval;
        await this._alphaVantageAPI
            .getIntraDayData(dataRetrievalJobDto.symbol, dataRetrievalJobDto.exchange, `${interval}min`)
            .then((data: IntraDayBar[]) => {
                Logger.log("AlphaVantageService : retrieveIntraDayData: success");
                this.saveIntraDayDataToDb(dataRetrievalJobDto.symbol, dataRetrievalJobDto.exchange, interval, data)
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
        return new DataRetrievalJobResponseDto("001");
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

    async retrieveDailyData(dataRetrievalJobDto: DataRetrievalJobDto): Promise<DataRetrievalJobResponseDto> {
        Logger.log(`AlphaVantageService : retrieveDailyData: dataRetrievalJobDto=${dataRetrievalJobDto}`);
        const interval: number = dataRetrievalJobDto.interval;
        await this._alphaVantageAPI
            .getDailyData(dataRetrievalJobDto.symbol, dataRetrievalJobDto.exchange, `${interval}min`)
            .then((data: DailyBar[]) => {
                Logger.log("AlphaVantageService : retrieveDailyData: success");
                this.saveDailyDataToDb(dataRetrievalJobDto.symbol, dataRetrievalJobDto.exchange, interval, data)
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
        return new DataRetrievalJobResponseDto("001");
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
