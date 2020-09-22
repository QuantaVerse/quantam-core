import { Injectable, Logger } from "@nestjs/common";

import { StockData } from "../db/entity/stock.data.entity";
import { StockDataService } from "../db/service/stock.data.service";
import { StockDataRequestDto } from "./dto/request/stock-data.request.dto";
import { QuantamDataRetrieverServiceInterface } from "./qd.retriever.interface";

/**
 * QuantamDataRetrieverService is an injectable instance made for QuantamDataRetrieverModule
 */
@Injectable()
export class QuantamDataRetrieverService implements QuantamDataRetrieverServiceInterface {
    constructor(private stockDataService: StockDataService) {}

    getHealth(): Record<string, string> {
        Logger.log("getHealth service call");
        return {
            status: "OK",
            message: "Quantam Data Retriever is up!"
        };
    }

    async fetchStockData(stockDataRequestDto: StockDataRequestDto): Promise<StockData[]> {
        return this.stockDataService.fetchStockData(stockDataRequestDto);
    }
}
