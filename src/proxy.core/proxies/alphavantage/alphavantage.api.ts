import { Logger } from "@nestjs/common";
import axios from "axios";
import { fromCSV, IDataFrame } from "data-forge";

import { StockDataBar } from "../../../common/interfaces/data.interface";
import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { buildUrl } from "../../../util/build.url";
import { IAlphavantageAPI } from "./alphavantage.interface";

export class AlphaVantageAPI implements IAlphavantageAPI {
    private readonly proxyJobLogService: ProxyJobLogService;
    private readonly baseUrl: string = "https://www.alphavantage.co";
    private readonly apiKey: string;
    private readonly dataType: string;
    private readonly outputSize: string;
    private readonly verbose: boolean;

    constructor(proxyJobLogService: ProxyJobLogService, apiKey: string, dataType: string, outputSize: string, verbose: boolean | undefined) {
        this.proxyJobLogService = proxyJobLogService;
        this.apiKey = apiKey;
        this.dataType = dataType;
        this.outputSize = outputSize;
        this.verbose = verbose !== undefined ? verbose : false;
    }

    async getHealth(): Promise<any> {
        const symbolSearchFunction = "SYMBOL_SEARCH";
        const demoAPIKey = "demo";
        const url: string = buildUrl(this.baseUrl, {
            path: "query",
            queryParams: {
                function: symbolSearchFunction,
                keywords: "tesco",
                apikey: demoAPIKey
            }
        });
        this.verbose && Logger.log("AlphaVantageAPI : getHealth url >> " + url);
        return await axios.get(url);
    }

    /**
     * TIME_SERIES_INTRADAY High Usage
     * @link https://www.alphavantage.co/documentation/#intraday
     *
     * This API returns intraday time series of the equity specified,
     * covering extended trading hours where applicable (e.g., 4:00am to 8:00pm Eastern Time for the US market).
     * The intraday data is computed directly from the Securities Information Processor (SIP) market-aggregated data feed.
     * You can query both raw (as-traded) and split/dividend-adjusted intraday data from this endpoint.
     *
     * This API returns the most recent 1-2 months of intraday data and
     * is best suited for short-term/medium-term charting and trading strategy development.
     * If you are targeting a deeper intraday history, please use the Extended Intraday API.
     *
     * @param {string} symbol
     * @param {string} exchange
     * @param {string} interval
     */
    getIntraDayDataUrl(symbol: string, exchange: string, interval: string): string {
        const intraDayFunction = "TIME_SERIES_INTRADAY";
        return buildUrl(this.baseUrl, {
            path: "query",
            queryParams: {
                function: intraDayFunction,
                symbol: symbol + (exchange !== "" ? `.${exchange}` : ``),
                apikey: this.apiKey,
                datatype: this.dataType,
                outputsize: this.outputSize,
                interval: interval
            }
        });
    }

    async getIntraDayData(symbol: string, exchange: string, interval: string): Promise<StockDataBar[]> {
        const url: string = this.getIntraDayDataUrl(symbol, exchange, interval);
        this.verbose && Logger.log("AlphaVantageAPI : getIntraDayData url >> " + url);

        const responseCSVString: string = await axios.get(url).then((response) => {
            this.verbose && Logger.log({ url: url, responseSize: response.data?.length });
            if (response?.data?.["Error Message"]) {
                throw new Error(response.data["Error Message"]);
            }
            return response.data;
        });

        const dataFrame: IDataFrame<number, any> = fromCSV(responseCSVString, {
            skipEmptyLines: true
        })
            .parseDates("timestamp", "YYYY-MM-DD HH:mm:ss")
            .parseFloats(["open", "high", "low", "close", "volume"])
            .renameSeries({
                timestamp: "Timestamp",
                open: "Open",
                high: "High",
                low: "Low",
                close: "Close",
                volume: "Volume"
            })
            .bake();

        return dataFrame.toArray();
    }

    /**
     * TIME_SERIES_DAILY
     * @link https://www.alphavantage.co/documentation/#daily
     *
     * This API returns raw (as-traded) daily time series (date, daily open, daily high, daily low, daily close, daily volume)
     * of the global equity specified, covering 20+ years of historical data. If you are also interested in
     * split/dividend-adjusted historical data, please use the Daily Adjusted API, which covers adjusted close values
     * and historical split and dividend events.
     *
     *
     * API Parameters
     *
     * Required: function
     *
     * The time series of your choice. In this case, function=TIME_SERIES_DAILY
     *
     * Required: symbol
     *
     * The name of the equity of your choice. For example: symbol=IBM
     *
     * Optional: outputsize
     *
     * By default, outputsize=compact. Strings compact and full are accepted with the following specifications: compact returns only the latest 100 data points; full returns the full-length time series of 20+ years of historical data. The "compact" option is recommended if you would like to reduce the data size of each API call.
     *
     * Optional: datatype
     *
     * By default, datatype=json. Strings json and csv are accepted with the following specifications: json returns the daily time series in JSON format; csv returns the time series as a CSV (comma separated value) file.
     *
     * Required: apikey
     *
     * Your API key. Claim your free API key here.
     *
     * Examples (click for JSON output)
     *
     * https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo
     *
     * https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&outputsize=full&apikey=demo
     *
     *
     * Downloadable CSV file:
     *
     * https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo&datatype=csv
     *
     * @param {string} symbol
     * @param {string} exchange
     * @param {string} interval
     */
    getDailyDataUrl(symbol: string, exchange: string, interval: string): string {
        const timeSeriesDailyFunction = "TIME_SERIES_DAILY";
        return buildUrl(this.baseUrl, {
            path: "query",
            queryParams: {
                function: timeSeriesDailyFunction,
                symbol: symbol + (exchange !== "" ? `.${exchange}` : ``),
                apikey: this.apiKey,
                datatype: this.dataType,
                outputsize: this.outputSize
            }
        });
    }

    async getDailyData(symbol: string, exchange: string, interval: string): Promise<StockDataBar[]> {
        const url: string = this.getDailyDataUrl(symbol, exchange, interval);
        this.verbose && Logger.log("AlphaVantageAPI : getDailyData url >> " + url);

        const responseCSVString: string = await axios.get(url).then((response) => {
            this.verbose && Logger.log({ url: url, responseLength: response.data?.length });
            if (response?.data?.["Error Message"]) {
                throw new Error(response.data["Error Message"]);
            }
            return response.data;
        });

        const dataFrame: IDataFrame<number, any> = fromCSV(responseCSVString, {
            skipEmptyLines: true
        })
            .parseDates("timestamp", "YYYY-MM-DD")
            .parseFloats(["open", "high", "low", "close", "volume"])
            .renameSeries({
                timestamp: "Timestamp",
                open: "Open",
                high: "High",
                low: "Low",
                close: "Close",
                volume: "Volume"
            })
            .bake();

        return dataFrame.toArray();
    }
}
