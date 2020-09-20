import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { StockData } from "../../../db/entity/stock.data.entity";
import { StockDataService } from "../../../db/service/stock.data.service";
import { DataRetrieverJobDto } from "../../../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "../../../retriever/dto/response/data-retriever-job-response.dto";
import { DailyBar, DataProxyInterface, IntraDayBar } from "../proxy/data.proxy.interface";
import { DataProxyService } from "../proxy/data.proxy.service";
import { AlphaVantageAPI } from "./alphavantage.api";

@Injectable()
export class AlphaVantageService extends DataProxyService implements DataProxyInterface {
    private _alphaVantageAPI;

    constructor(private configService: ConfigService, private stockDataService: StockDataService) {
        super();
        this.PROXY_NAME = "AlphaVantage";
        this.API_KEY_NAME = "PROXY_APIKEY_ALPHA_VANTAGE";
        this.API_KEY = this.configService.get<string>(this.API_KEY_NAME);

        this._alphaVantageAPI = new AlphaVantageAPI(this.API_KEY, "full", true);
    }

    retrieveIntraDayData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto {
        const interval = dataRetrieverJobDto.interval;
        return this._alphaVantageAPI
            .getIntraDayData(dataRetrieverJobDto.symbol, `${interval}min`)
            .then((data: IntraDayBar[]) => {
                Logger.log("retrieveIntraDayData: success");
                this.saveIntraDayDataToDb(dataRetrieverJobDto.symbol, interval, data)
                    .then(() => {
                        Logger.log("saveIntraDayDataToDb: success");
                    })
                    .catch(error => {
                        Logger.log("saveIntraDayDataToDb: failed", error);
                    });
            })
            .catch(error => {
                if (error.toString().startsWith("Error:")) {
                    Logger.warn("retrieveIntraDayData: error", error);
                    throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
                } else {
                    Logger.error("retrieveIntraDayData: error", error);
                    throw new HttpException(error.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            })
            .finally(() => {
                return new DataRetrieverJobResponseDto("001");
            });
    }

    async saveIntraDayDataToDb(symbol: string, interval: number, data: IntraDayBar[]): Promise<void> {
        Logger.log(`saveIntraDayDataToDb: symbol=${symbol} interval=${interval} data size ${data.length}`);
        data.forEach(d => {
            const stockData = new StockData(
                symbol,
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

    retrieveDailyData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto {
        const interval = dataRetrieverJobDto.interval;
        return this._alphaVantageAPI
            .getDailyData(dataRetrieverJobDto.symbol, `${interval}min`)
            .then((data: DailyBar[]) => {
                Logger.log("retrieveDailyData: success");
                this.saveDailyDataToDb(dataRetrieverJobDto.symbol, interval, data)
                    .then(() => {
                        Logger.log("saveDailyDataToDb: success");
                    })
                    .catch(error => {
                        Logger.log("saveDailyDataToDb: failed", error);
                    });
            })
            .catch(error => {
                if (error.toString().startsWith("Error:")) {
                    Logger.warn("retrieveDailyData: error", error);
                    throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
                } else {
                    Logger.error("retrieveDailyData: error", error);
                    throw new HttpException(error.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            })
            .finally(() => {
                return new DataRetrieverJobResponseDto("001");
            });
    }

    async saveDailyDataToDb(symbol: string, interval: number, data: DailyBar[]): Promise<void> {
        Logger.log(`saveDailyDataToDb: symbol=${symbol} interval=${interval} data size ${data.length}`);
        data.forEach(d => {
            const stockData = new StockData(
                symbol,
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
