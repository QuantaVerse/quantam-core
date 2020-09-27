import { Logger } from "@nestjs/common";
import axios from "axios";

import { StockDataBar } from "../../../common/interfaces/data.interface";
import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { buildUrl } from "../../../util/build.url";
import { IMarketStackAPI } from "./marketstack.interface";

export class MarketStackAPI implements IMarketStackAPI {
    private readonly proxyJobLogService: ProxyJobLogService;
    private readonly baseUrl: string = "http://api.marketstack.com";
    private readonly apiKey: string;
    private readonly verbose: boolean;

    constructor(proxyJobLogService: ProxyJobLogService, apiKey: string, verbose: boolean | undefined) {
        this.proxyJobLogService = proxyJobLogService;
        this.apiKey = apiKey;
        this.verbose = verbose !== undefined ? verbose : false;
    }

    async getHealth(): Promise<any> {
        const demoAPIKey = "demo";
        const url: string = buildUrl(this.baseUrl, {
            path: "v1/eod",
            queryParams: {
                access_key: demoAPIKey
            }
        });
        this.verbose && Logger.log("MarketStackAPI : getHealth url >> " + url);
        return await axios.get(url);
    }

    /**
     * TIME_SERIES_INTRA_DAY
     * @link https://marketstack.com/documentation#intraday_data
     *
     * Intraday Data
     * Available on: Basic Plan and higher
     *
     * In additional to daily end-of-day stock prices, the marketstack API also supports intraday data with
     * data intervals as short as one minute.
     *
     * Intraday prices are available for all US stock tickers included in the IEX (Investors Exchange) stock exchange.
     *
     * To obtain intraday data, you can use the API's intraday endpoint and specify your preferred stock ticker symbols.
     *
     * @param {string} symbol
     * @param {string} exchange
     * @param {string} interval
     */
    getIntraDayDataUrl(symbol: string, exchange: string, interval: string): string {
        return buildUrl(this.baseUrl, {
            path: "/tickers/" + symbol + (exchange !== "" ? `.${exchange}` : ``) + "/intraday",
            queryParams: {
                access_key: this.apiKey,
                interval: interval
            }
        });
    }

    getIntraDayData(symbol: string, exchange: string, interval: string): Promise<StockDataBar[]> {
        // TODO: implement
        return Promise.resolve([]);
    }

    /**
     * TIME_SERIES_DAILY
     * @link https://marketstack.com/documentation#eod
     *
     * @param {string} symbol
     * @param {string} exchange
     * @param {string} interval
     */
    getDailyDataUrl(symbol: string, exchange: string, interval: string): string {
        return buildUrl(this.baseUrl, {
            path: "/tickers/" + symbol + (exchange !== "" ? `.${exchange}` : ``) + "/eod",
            queryParams: {
                access_key: this.apiKey,
                interval: interval
            }
        });
    }

    getDailyData(symbol: string, exchange: string, interval: string): Promise<StockDataBar[]> {
        // TODO: implement
        return Promise.resolve([]);
    }
}
