import { StockData } from "../../../db/entity/stock.data.entity";
import { StockDataRequestDto } from "../request/stock-data.request.dto";

export class StockDataResponseDto {
    metadata: StockDataRequestDto;
    data: StockData[];

    constructor(metadata: StockDataRequestDto, data: StockData[]) {
        this.metadata = metadata;
        this.data = data;
    }
}
