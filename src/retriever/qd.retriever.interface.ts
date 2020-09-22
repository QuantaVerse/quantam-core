import { StockData } from "../db/entity/stock.data.entity";
import { StockDataRequestDto } from "./dto/request/stock-data.request.dto";

/**
 * @interface QuantamDataRetrieverServiceInterface
 * Used as the service interface for QuantamDataRetrieverService
 */
export interface QuantamDataRetrieverServiceInterface {
    getHealth(): Record<string, string>;
    fetchStockData(stockDataRequestDto: StockDataRequestDto): Promise<StockData[]>;
}
