import { Logger } from "@nestjs/common";
import axios from "axios";
import { fromCSV } from "data-forge";

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
    private readonly baseUrl = "https://www.alphavantage.co";
    private readonly apiKey: string;
    private readonly outputDataSize: string;
    private readonly verbose: boolean;

    constructor(apiKey: string, outputDataSize: string | undefined, verbose: boolean | undefined) {
        this.apiKey = apiKey;
        this.outputDataSize = outputDataSize !== undefined ? outputDataSize : "compact";
        this.verbose = verbose !== undefined ? verbose : false;
    }

    async getIntraDayData(symbol: string, interval: string): Promise<IntraDayBar[]> {
        const url = `${this.baseUrl}/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&apikey=${this.apiKey}&datatype=csv&outputsize=${this.outputDataSize}&interval=${interval}`;
        this.verbose && Logger.log("AlphaVantageAPI getIntraDayData url >> " + url);

        const responseCSVString = await axios.get(url).then(response => {
            Logger.log({ url: url, response: response.data });
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
}
