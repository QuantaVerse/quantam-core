import axios from "axios";
import dataForge from "data-forge";

export class DailyBar {
    Timestamp: Date;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
    AdjClose: number;
    DividendAmount: number;
    SplitCoefficient: number;
}

export class IntraDayBar {
    Timestamp: Date;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
}

export class AlphaVantageAPI {
    // Your Alpha Vantage API key.
    apiKey: string;
    // The data size to output: full, compact
    outputDataSize: string;
    verbose: boolean;

    private baseUrl = "https://www.alphavantage.co";

    constructor(apiKey: string, outputDataSize: string, verbose: boolean | undefined) {
        this.apiKey = apiKey;
        this.outputDataSize = outputDataSize;
        this.verbose = verbose !== undefined ? verbose : false;
    }

    // Retrieve stock data from Alpha Vantage.
    async getDailyDataFrame(symbol: string): Promise<any> {
        const url =
            this.baseUrl +
            "/query" +
            "?function=TIME_SERIES_DAILY_ADJUSTED" +
            "&symbol=" +
            symbol +
            "&apikey=" +
            this.apiKey +
            "&datatype=csv" +
            "&outputsize=" +
            this.outputDataSize;

        if (this.verbose) {
            console.log("<< " + url);
        }

        const response = await axios
            .get(url)
            .then(function(response) {
                if (response?.data?.["Error Message"]) {
                    throw new Error(response?.data?.["Error Message"]);
                }
                return dataForge
                    .fromCSV(response.data, { skipEmptyLines: true })
                    .parseDates("timestamp", "YYYY-MM-DD")
                    .parseFloats([
                        "open",
                        "high",
                        "low",
                        "close",
                        "adjusted_close",
                        "volume",
                        "dividend_amount",
                        "split_coefficient"
                    ])
                    .renameSeries({
                        timestamp: "Timestamp",
                        open: "Open",
                        high: "High",
                        low: "Low",
                        close: "Close",
                        adjusted_close: "AdjClose",
                        volume: "Volume",
                        dividend_amount: "DividendAmount",
                        split_coefficient: "SplitCoefficient"
                    })
                    .bake();
            })
            .catch(function(error) {
                console.log(error);
            })
            .then(function() {
                // always executed
            });
    }

    async getDailyData(symbol: string): Promise<DailyBar[]> {
        return (await this.getDailyDataFrame(symbol)).toArray();
    }

    async getIntraDayDataFrame(symbol: string, interval: string): Promise<any> {
        const url: string =
            this.baseUrl +
            "/query" +
            "?function=TIME_SERIES_INTRADAY" +
            "&symbol=" +
            symbol +
            "&apikey=" +
            this.apiKey +
            "&datatype=csv" +
            "&outputsize=" +
            this.outputDataSize +
            "&interval=" +
            interval;

        if (this.verbose) {
            console.log("<< " + url);
        }

        await axios
            .get(url)
            .then(function(response) {
                if (response?.data?.["Error Message"]) {
                    console.log(response.data);
                    throw new Error(response?.data?.["Error Message"]);
                }
                return dataForge
                    .fromCSV(response.data, { skipEmptyLines: true })
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
            })
            .catch(function(error) {
                console.log(error);
            })
            .then(function() {
                // always executed
            });
    }

    async getIntraDayData(symbol: string, interval: string): Promise<IntraDayBar[]> {
        return await this.getIntraDayDataFrame(symbol, interval);
    }
}
