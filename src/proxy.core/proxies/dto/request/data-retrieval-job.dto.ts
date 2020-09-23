import { IntervalEnum } from "../../../../common/interfaces/data.interface";

export class DataRetrievalJobDto {
    symbol: string;
    exchange: string;
    interval: IntervalEnum;
    fromDate: Date;
    toDate: Date;
    proxy?: string;

    constructor(
        symbol: string,
        exchange: string,
        interval: IntervalEnum,
        fromDate: Date,
        toDate: Date,
        proxy?: string
    ) {
        this.symbol = symbol;
        this.exchange = exchange;
        this.interval = interval;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.proxy = proxy;
    }
}
