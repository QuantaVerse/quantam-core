import { IntervalEnum } from "../../../../common/interfaces/data.interface";

export class DataRetrievalJobDto {
    symbol: string;
    exchange: string;
    interval: IntervalEnum;
    from_date: Date;
    to_date: Date;
    proxy?: string;

    constructor(
        symbol: string,
        exchange: string,
        interval: IntervalEnum,
        from_date: Date,
        to_date: Date,
        proxy?: string
    ) {
        this.symbol = symbol;
        this.exchange = exchange;
        this.interval = interval;
        this.from_date = from_date;
        this.to_date = to_date;
        this.proxy = proxy;
    }
}
