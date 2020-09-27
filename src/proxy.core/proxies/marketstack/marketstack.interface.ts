import { ExchangeEnum, IntervalEnum } from "../../../common/interfaces/data.interface";
import { DataType, OutputSize } from "../alphavantage/alphavantage.interface";
import { IDataProxyConfig } from "../proxy/data.proxy.interface";

/**
 * Time interval between two consecutive data points in the time series.
 * interval 	[Optional] Specify your preferred data interval.
 * Available values: 1min, 5min, 10min, 15min, 30min, 1h (Default), 3h, 6h, 12h and 24h.
 */
export function marketStackInterval(interval: IntervalEnum): string {
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
            return "1h";
        case IntervalEnum.THREE_HOUR:
            return "3h";
        case IntervalEnum.SIX_HOUR:
            return "6h";
        case IntervalEnum.TWELVE_HOUR:
            return "12h";
        case IntervalEnum.ONE_DAY:
            return "eod";
        default:
            throw Error(`Interval='${interval}' is unknown to MarketStack`);
    }
}

export function marketStackExchange(exchange: ExchangeEnum): string {
    switch (exchange) {
        case ExchangeEnum.BSE:
            return "XBOM";
        case ExchangeEnum.NSE:
            return "XNSE";
        case ExchangeEnum.NYSE:
            return "XNYS";
        case ExchangeEnum.NASDAQ:
            return "XNAS";
        default:
            throw Error(`Exchange='${exchange}' is unknown to AlphaVantage`);
    }
}

export class MarketStackConfig implements IDataProxyConfig {
    openExchanges: ExchangeEnum[];
    intraDayIntervals: IntervalEnum[];
    additionalConfig: Record<string, string>;

    constructor(openExchanges: ExchangeEnum[] | undefined = undefined, intraDayIntervals: IntervalEnum[] | undefined = undefined) {
        this.openExchanges =
            openExchanges !== undefined ? openExchanges : [ExchangeEnum.NASDAQ, ExchangeEnum.NYSE, ExchangeEnum.NSE, ExchangeEnum.BSE];
        this.intraDayIntervals =
            intraDayIntervals !== undefined
                ? intraDayIntervals
                : [
                      IntervalEnum.ONE_MIN,
                      IntervalEnum.FIVE_MIN,
                      IntervalEnum.FIFTEEN_MIN,
                      IntervalEnum.THIRTY_MIN,
                      IntervalEnum.ONE_HOUR,
                      IntervalEnum.THREE_HOUR,
                      IntervalEnum.SIX_HOUR,
                      IntervalEnum.TWELVE_HOUR
                  ];
        this.additionalConfig = {};
    }
}

export interface IMarketStackAPI {
    getHealth(): Promise<any>;
}
