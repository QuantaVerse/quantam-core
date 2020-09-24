import { IntervalEnum } from "../../../common/interfaces/data.interface";

export class DataRetrievalJobDto {
    symbol: string;
    exchange: string;
    interval: IntervalEnum;
    fromDate: Date;
    toDate: Date;
    referrer = "None";
    proxy?: string;

    constructor(
        symbol: string,
        exchange: string,
        interval: IntervalEnum,
        fromDate: Date,
        toDate: Date,
        referrer?: string,
        proxy?: string
    ) {
        this.symbol = symbol;
        this.exchange = exchange;
        this.interval = interval;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.referrer = referrer;
        this.proxy = proxy;
    }
}
