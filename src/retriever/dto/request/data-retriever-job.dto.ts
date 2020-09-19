export class DataRetrieverJobDto {
    exchange: string;
    symbol: string;
    interval: number;
    from_date: Date;
    to_date: Date;
    proxy?: string;
}
