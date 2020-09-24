import { Injectable, Logger } from "@nestjs/common";

import { StockData } from "../db/entity/stock.data.entity";
import { StockDataService } from "../db/service/stock.data.service";
import { DataRetrievalJobDto } from "../proxy.core/dto/request/data-retrieval-job.dto";
import { ProxyManagerService } from "../proxy.core/proxy.manager.service";
import { StockDataRequestDto } from "./dto/request/stock-data.request.dto";
import { QuantamDataRetrieverServiceInterface } from "./qd.retriever.interface";

/**
 * QuantamDataRetrieverService is an injectable instance made for QuantamDataRetrieverModule
 */
@Injectable()
export class QuantamDataRetrieverService implements QuantamDataRetrieverServiceInterface {
    constructor(private stockDataService: StockDataService, private readonly proxyManagerService: ProxyManagerService) {}

    /**
     * @method getHealth
     * @returns {Record<string, string>}
     */
    getHealth(): Record<string, string> {
        Logger.log("QuantamDataRetrieverService : getHealth");
        return {
            status: "OK",
            message: "Quantam Data Retriever is up!"
        };
    }

    /**
     * @method fetchStockData
     * fetch stock data from stockDataService
     * @param {StockDataRequestDto} stockDataRequestDto
     * @returns {Promise<StockData[]>}
     */
    async fetchStockData(stockDataRequestDto: StockDataRequestDto): Promise<StockData[]> {
        Logger.log(
            `QuantamDataRetrieverService : fetchStockData from stockDataService : stockDataRequestDto=${JSON.stringify(
                stockDataRequestDto
            )}`
        );
        return this.stockDataService.fetchStockData(stockDataRequestDto);
    }

    /**
     * @method retrieveStockDataFromProxyManager
     * retrieve StockData from ProxyManager
     * @param stockDataRequestDto
     * @param sync
     * @returns {Promise<StockData[]>}
     */
    async retrieveStockDataFromProxyManager(stockDataRequestDto: StockDataRequestDto, sync: boolean): Promise<StockData[]> {
        const dataRetrievalJobDto = new DataRetrievalJobDto(
            stockDataRequestDto.symbol,
            stockDataRequestDto.exchange,
            stockDataRequestDto.interval,
            stockDataRequestDto.startDate,
            stockDataRequestDto.endDate,
            "QuantamDataRetrieverService"
        );
        Logger.log(
            `QuantamDataRetrieverService : retrieve StockData from ProxyManager : stockDataRequestDto=${JSON.stringify(
                stockDataRequestDto
            )} sync=${sync}`
        );
        let stockData: StockData[] = [];
        if (sync) {
            await this.proxyManagerService.createDataRetrievalJob(dataRetrievalJobDto);
            Logger.log(`QuantamDataRetrieverService : DataRetrieval request completed`);
            stockData = await this.fetchStockData(stockDataRequestDto);
        } else {
            this.proxyManagerService.createDataRetrievalJob(dataRetrievalJobDto).then(() => {
                Logger.log(`QuantamDataRetrieverService : DataRetrieval request completed`);
            });
        }
        return stockData;
    }
}
