import { IsNotEmpty } from "class-validator";

import { ExchangeEnum, getExchangeEnum, getIntervalEnum, IntervalEnum } from "../../../common/interfaces/data.interface";

export class StockDataRequestDto {
    @IsNotEmpty()
    symbol: string;

    @IsNotEmpty()
    exchange: ExchangeEnum;

    @IsNotEmpty()
    interval: IntervalEnum;

    startDate: Date;

    endDate: Date;

    constructor(symbol: string, exchange: string, interval?: string, startDate?: string, endDate?: string, limit = 1) {
        this.symbol = symbol;
        this.exchange = getExchangeEnum(exchange);
        if (interval === undefined) {
            this.interval = getIntervalEnum("1d");
        } else if (new RegExp(/\d{1,5}\w{1,5}/i).test(interval)) {
            this.interval = getIntervalEnum(interval);
        } else {
            throw new Error("Invalid interval regex");
        }
        if (endDate === undefined) {
            this.endDate = new Date();
        } else {
            this.endDate = new Date(endDate);
            if (isNaN(this.endDate.getTime())) {
                throw new Error("Invalid endDate");
            }
        }
        if (startDate === undefined) {
            if (limit === undefined || limit <= 0) {
                limit = 1;
            }
            this.startDate = new Date(this.endDate.getTime() - limit * this.interval * 60000);
        } else {
            this.startDate = new Date(startDate);
            if (isNaN(this.startDate.getTime())) {
                throw new Error("Invalid startDate");
            }
        }
    }
}
