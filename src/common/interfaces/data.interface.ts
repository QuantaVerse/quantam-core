export class DailyBar {
    Timestamp: Date;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
}

export class IntraDayBar {
    Timestamp: Date;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
}

export enum ExchangeEnum {
    NSE = "NSE",
    BSE = "BSE",
    NASDAQ = "NASDAQ",
    NYSE = "NYSE"
}

export function getExchangeEnum(exchange: string): ExchangeEnum {
    const exchangeMap = new Map<ExchangeEnum, string[]>();
    exchangeMap.set(ExchangeEnum.NYSE, ["NYSE", "nyse"]);
    exchangeMap.set(ExchangeEnum.NASDAQ, ["NASDAQ", "nasdaq"]);
    exchangeMap.set(ExchangeEnum.NSE, ["NSE", "nse"]);
    exchangeMap.set(ExchangeEnum.BSE, ["BSE", "bse"]);

    const reverseMap = new Map<string, ExchangeEnum>();
    exchangeMap.forEach((intervalStrings, exchangeEnum) => {
        intervalStrings.forEach((str) => {
            reverseMap.set(str, exchangeEnum);
        });
    });
    if (reverseMap.has(exchange.toString())) {
        return reverseMap.get(exchange.toString());
    } else {
        throw new Error(`Exchange '${exchange}' is not a valid exchange`);
    }
}

export enum IntervalEnum {
    ONE_MIN = 1, // 1 minute
    FIVE_MIN = 5, // 5 minutes
    TEN_MIN = 10, // 10 minutes
    FIFTEEN_MIN = 15, // 15 minutes
    THIRTY_MIN = 30, // 30 minutes
    ONE_HOUR = 60, // 1 hour
    THREE_HOUR = 180, // 3 hours
    SIX_HOUR = 360, // 6 hours
    TWELVE_HOUR = 720, // 12 hours
    ONE_DAY = 1440, // 1 day
    ONE_WEEK = 10080, // 1 week
    ONE_MONTH = 43200 // 1 Month
}

export function getIntervalEnum(interval: string): IntervalEnum {
    const intervalMap = new Map<IntervalEnum, string[]>();
    intervalMap.set(IntervalEnum.ONE_MIN, ["1min", "1m", "1"]);
    intervalMap.set(IntervalEnum.FIVE_MIN, ["5min", "5m", "5"]);
    intervalMap.set(IntervalEnum.TEN_MIN, ["10min", "10m", "10"]);
    intervalMap.set(IntervalEnum.FIFTEEN_MIN, ["15min", "15m", "15"]);
    intervalMap.set(IntervalEnum.THIRTY_MIN, ["30min", "30m", "30"]);
    intervalMap.set(IntervalEnum.ONE_HOUR, ["1hour", "1h", "60min", "60"]);
    intervalMap.set(IntervalEnum.THREE_HOUR, ["3hour", "3h", "180min", "180"]);
    intervalMap.set(IntervalEnum.SIX_HOUR, ["6hour", "6h", "360min", "360"]);
    intervalMap.set(IntervalEnum.TWELVE_HOUR, ["12hour", "12h", "720min", "720"]);
    intervalMap.set(IntervalEnum.ONE_DAY, ["1day", "1d", "1440"]);
    intervalMap.set(IntervalEnum.ONE_WEEK, ["1week", "1w"]);
    intervalMap.set(IntervalEnum.ONE_MONTH, ["1month", "1mon"]);

    const reverseMap = new Map<string, IntervalEnum>();
    intervalMap.forEach((intervalStrings, intervalEnum) => {
        intervalStrings.forEach((str) => {
            reverseMap.set(str, intervalEnum);
        });
    });
    if (reverseMap.has(interval.toString())) {
        return reverseMap.get(interval.toString());
    } else {
        throw new Error(`Interval '${interval}' is not a valid interval`);
    }
}
