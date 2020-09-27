import { Controller, Get, HttpException, HttpStatus, Logger, Query } from "@nestjs/common";

import { StockData } from "../db/entity/stock.data.entity";
import { StockDataRequestDto } from "./dto/request/stock-data.request.dto";
import { StockDataResponseDto } from "./dto/response/stock-data.response.dto";
import { QuantamDataRetrieverService } from "./qd.retriever.service";

/**
 * QuantamDataRetrieverController is an injectable instance made for QuantamDataRetrieverModule.
 *
 * API path prefix: retriever
 *
 * APIs available:
 * 1. /GET health
 * 2. /GET fetchStockData
 */
@Controller("retriever")
export class QuantamDataRetrieverController {
    constructor(private readonly dataRetrieverService: QuantamDataRetrieverService) {}

    /**
     * API Endpoint for checking health of Quantam Data Retriever module.
     * Used for fetching current status of the module.
     *
     * @return {Record<string, string>}
     */
    @Get("health")
    getHealth(): Record<string, string> {
        Logger.log("QuantamDataRetrieverController : health");
        return this.dataRetrieverService.getHealth();
    }

    /**
     * API Endpoint for fetching stock data.
     *
     * Steps:
     * 1. Check stockData collection for required stock data.
     * 2. Validate the output from StockDataService and cache the validation.
     * 3. If validation failed or data not found, create a dataRetrievalJob in ProxyManagerService.
     * 4. If sync is true, try to fetch the data again post dataRetrievalJob completion.
     *
     * Valid URL params: "symbol", "exchange", "interval", "startDate", "endDate"
     *
     *      Example endpoint:
     *
     *      https://api.qd-core.com/retriever/fetchStockData?exchange=NSE&symbol=HDFC&interval=1day
     *
     * @param {string} symbol - the abbrev. symbol of the stock
     * @param {string} [exchange=NSE] - the exchange associated with the symbol
     * @param {string} [interval=1day] - the interval between stock data columns
     * interval should follow the regex pattern /\d{1,5}\w{1,5}/i
     * intervals are case ignored
     * computation and validation check happens on any interval to reduce it to system defined enum `IntervalEnum`.
     * common valid intervals = ["1m", "1min", "5m", "60m", "1h", "1hour", "1d", "1day", "1w", "1week", "1month"]
     * @param {string} [startDate=currentTime-interval*limit] - data gets fetched from startDate to endDate
     * @param {string} [endDate=currentTime] - data gets fetched from startDate to endDate
     * startDate and endDate should have any format accepted by JavaScript Date.parse()
     * Following formats are recommended: "yyyy-mm-dd:hh:mm:ss" OR "yyyy-mm-dd" OR ISOString()
     * @param {number} [limit=1] - Number of stockData bars. Useful only if startDate is not mentioned.
     * @param {boolean} [sync=false] - if sync is true, data will be fetched synchronously in case data is not found
     *
     * @returns {Promise<StockDataResponseDto | HttpException>}
     */
    @Get("fetchStockData")
    async fetchStockData(
        @Query("symbol") symbol: string,
        @Query("exchange") exchange = "NSE",
        @Query("interval") interval = "1d",
        @Query("startDate") startDate?: string,
        @Query("endDate") endDate?: string,
        @Query("limit") limit = 1,
        @Query("sync") sync = false
    ): Promise<StockDataResponseDto | HttpException> {
        Logger.log(
            `QuantamDataRetrieverController : fetchStockData symbol=${symbol} exchange=${exchange} interval=${interval} startDate=${startDate} endDate=${endDate} limit=${limit} sync=${sync}`
        );
        let stockDataRequestDto: StockDataRequestDto;
        try {
            stockDataRequestDto = new StockDataRequestDto(symbol, exchange, interval, startDate, endDate, limit);
        } catch (error) {
            return new HttpException(`ValidationError : ${error}`, HttpStatus.BAD_REQUEST);
        }
        Logger.log(`QuantamDataRetrieverController : stockDataRequestDto=${JSON.stringify(stockDataRequestDto)}`);
        let stockData: StockData[] = await this.dataRetrieverService.fetchStockData(stockDataRequestDto);
        if (stockData.length > 0) {
            Logger.log(`QuantamDataRetrieverController : stockData found with length = ${stockData.length}`);
        } else {
            Logger.log(
                `QuantamDataRetrieverController : stockData found with length = ${stockData.length}; sending DataRetrieval request to ProxyManager`
            );
            stockData = await this.dataRetrieverService.retrieveStockDataFromProxyManager(stockDataRequestDto, sync);
        }
        return new StockDataResponseDto(stockDataRequestDto, stockData);
    }
}
