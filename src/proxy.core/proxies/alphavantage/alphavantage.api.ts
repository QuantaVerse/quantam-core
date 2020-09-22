import { Logger } from "@nestjs/common";
import axios from "axios";
import { fromCSV, IDataFrame } from "data-forge";

import { DailyBar, IntraDayBar } from "../../../common/interfaces/data.interface";
import { buildUrl } from "../../../util/build.url";
import { DataType, IAlphavantageAPI, OutputSize } from "./alphavantage.interface";

export class AlphaVantageAPI implements IAlphavantageAPI {
    private readonly baseUrl: string = "https://www.alphavantage.co";
    private readonly apiKey: string;
    private readonly dataType: DataType;
    private readonly outputSize: OutputSize;
    private readonly verbose: boolean;

    constructor(apiKey: string, dataType: DataType, outputSize: OutputSize, verbose: boolean | undefined) {
        this.apiKey = apiKey;
        this.dataType = dataType;
        this.outputSize = outputSize;
        this.verbose = verbose !== undefined ? verbose : false;
    }

    // TODO: save all API call logs
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

    async getIntraDayData(symbol: string, interval: string): Promise<IntraDayBar[]> {
        const intraDayFunction = "TIME_SERIES_INTRADAY";
        const url: string = buildUrl(this.baseUrl, {
            path: "query",
            queryParams: {
                function: intraDayFunction,
                symbol: symbol,
                apikey: this.apiKey,
                datatype: this.dataType,
                outputsize: this.outputSize,
                interval: interval
            }
        });
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

    async getDailyData(symbol: string, interval: string): Promise<DailyBar[]> {
        const timeSeriesDailyFunction = "TIME_SERIES_DAILY";
        const url: string = buildUrl(this.baseUrl, {
            path: "query",
            queryParams: {
                function: timeSeriesDailyFunction,
                symbol: symbol,
                apikey: this.apiKey,
                datatype: this.dataType,
                outputsize: this.outputSize
            }
        });
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
