export class CreateRetrieverJobDto {
    exchange: string;
    symbol: string;
    interval: string;
    from_date: Date;
    to_date: Date;
    proxy: string;
}
