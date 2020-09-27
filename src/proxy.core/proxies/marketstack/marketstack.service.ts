import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IntervalEnum } from "../../../common/interfaces/data.interface";
import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { StockDataRetrievalJobDto } from "../../dto/request/stock-data-retrieval-job.dto";
import { StockDataRetrievalJobResponseDto } from "../../dto/response/stock-data-retrieval-job-response.dto";
import { alphaVantageExchange } from "../alphavantage/alphavantage.interface";
import { DataProxyInterface } from "../proxy/data.proxy.interface";
import { DataProxyService } from "../proxy/data.proxy.service";
import { MarketStackAPI } from "./marketstack.api";
import { IMarketStackAPI, MarketStackConfig } from "./marketstack.interface";

@Injectable()
export class MarketStackService extends DataProxyService implements DataProxyInterface {
    private readonly _marketStackAPI: IMarketStackAPI;
    private readonly MARKET_STACK_CONFIG;

    constructor(private configService: ConfigService, proxyJobLogService: ProxyJobLogService) {
        super(proxyJobLogService);
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
        Logger.log(`AlphaVantageService : retrieveStockData: stockDataRetrievalJobDto=${JSON.stringify(stockDataRetrievalJobDto)} jobId=${jobId}`);
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
}
