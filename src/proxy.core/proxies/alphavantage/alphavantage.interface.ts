import { DailyBar, ExchangeEnum, IntervalEnum, IntraDayBar } from "../../../common/interfaces/data.interface";

export enum OutputSize {
    Full = "full",
    Compact = "compact"
}

export enum DataType {
    CSV = "csv",
    JSON = "json"
}

/**
 * Time interval between two consecutive data points in the time series.
 * The following values are supported: 1min, 5min, 15min, 30min, 60min, daily, weekly, monthly
 */
export function alphaVantageInterval(interval: IntervalEnum): string {
    switch (interval) {
        case IntervalEnum.ONE_MIN:
            return "1min";
        case IntervalEnum.FIVE_MIN:
            return "5min";
        case IntervalEnum.FIFTEEN_MIN:
            return "15min";
        case IntervalEnum.THIRTY_MIN:
            return "30min";
        case IntervalEnum.ONE_HOUR:
            return "60min";
        case IntervalEnum.ONE_DAY:
            return "daily";
        case IntervalEnum.ONE_WEEK:
            return "weekly";
        case IntervalEnum.ONE_MONTH:
            return "monthly";
        default:
            throw Error(`Interval='${interval}' is unknown to AlphaVantage`);
    }
}

export function alphaVantageExchange(exchange: ExchangeEnum): string {
    switch (exchange) {
        case ExchangeEnum.BSE:
            return "BSE";
        case ExchangeEnum.NSE:
            return "NSE";
        case ExchangeEnum.NYSE:
            return "";
        case ExchangeEnum.NASDAQ:
            return "";
        default:
            throw Error(`Exchange='${exchange}' is unknown to AlphaVantage`);
    }
}

export class AlphavantageProxyConfig {
    preferredDataType: string;
    preferredOutputSize: string;
    intraDayIntervals: IntervalEnum[];

    constructor(preferredDataType: DataType | undefined, preferredOutputSize: OutputSize | undefined) {
        this.preferredDataType = preferredDataType !== undefined ? preferredDataType : DataType.JSON;
        this.preferredOutputSize = preferredOutputSize !== undefined ? preferredOutputSize : OutputSize.Compact;
        this.intraDayIntervals = [
            IntervalEnum.ONE_MIN,
            IntervalEnum.FIVE_MIN,
            IntervalEnum.FIFTEEN_MIN,
            IntervalEnum.THIRTY_MIN,
            IntervalEnum.ONE_HOUR
        ];
    }
}

export interface IAlphavantageAPI {
    getHealth(): Promise<any>;
    getIntraDayDataUrl(symbol: string, exchange: string, interval: string): string;
    getIntraDayData(symbol: string, exchange: string, interval: string): Promise<IntraDayBar[]>;
    getDailyDataUrl(symbol: string, exchange: string, interval: string): string;
    getDailyData(symbol: string, exchange: string, interval: string): Promise<DailyBar[]>;
}
