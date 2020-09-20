import { Logger } from "@nestjs/common";
import axios from "axios";
import { fromCSV } from "data-forge";

import { DailyBar, IntraDayBar } from "../proxy/data.proxy.interface";

declare type OutputSize = "full" | "compact" | string;

export class AlphaVantageAPI {
    private readonly baseUrl = "https://www.alphavantage.co";
    private readonly apiKey: string;
    private readonly outputDataSize: OutputSize;
    private readonly verbose: boolean;

    constructor(apiKey: string, outputDataSize: string | undefined, verbose: boolean | undefined) {
        this.apiKey = apiKey;
        this.outputDataSize = outputDataSize !== undefined ? outputDataSize : "compact";
        this.verbose = verbose !== undefined ? verbose : false;
    }

    async getIntraDayData(symbol: string, interval: string): Promise<IntraDayBar[]> {
        const url = `${this.baseUrl}/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&apikey=${this.apiKey}&datatype=csv&outputsize=${this.outputDataSize}&interval=${interval}`;
        this.verbose && Logger.log("AlphaVantageAPI getIntraDayData url >> " + url);

        const responseCSVString = await axios.get(url).then((response) => {
            Logger.log({ url: url, responseSize: response.data?.length });
            if (response?.data?.["Error Message"]) {
                throw new Error(response.data["Error Message"]);
            }
            return response.data;
        });

        const dataFrame = fromCSV(responseCSVString, {
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
        const url = `${this.baseUrl}/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.apiKey}&datatype=csv&outputsize=${this.outputDataSize}`;
        this.verbose && Logger.log("AlphaVantageAPI getDailyData url >> " + url);

        const responseCSVString = await axios.get(url).then((response) => {
            Logger.log({ url: url, responseLength: response.data?.length });
            if (response?.data?.["Error Message"]) {
                throw new Error(response.data["Error Message"]);
            }
            return response.data;
        });

        const dataFrame = fromCSV(responseCSVString, {
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
