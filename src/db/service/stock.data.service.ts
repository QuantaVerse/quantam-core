import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";
import { InsertResult } from "typeorm/query-builder/result/InsertResult";

import { StockDataRequestDto } from "../../retriever/dto/request/stock-data.request.dto";
import { StockData } from "../entity/stock.data.entity";

@Injectable()
export class StockDataService {
    constructor(
        @InjectRepository(StockData)
        private stockDataRepository: Repository<StockData>
    ) {}

    async create(stockData: StockData): Promise<InsertResult> {
        return await this.stockDataRepository.insert(stockData);
    }

    async upsert(stockData: StockData): Promise<StockData> {
        return await this.stockDataRepository.save(stockData);
    }

    async fetchStockData(stockDataRequestDto: StockDataRequestDto) {
        return await this.stockDataRepository.find({
            where: {
                symbol: stockDataRequestDto.symbol,
                exchange: stockDataRequestDto.exchange,
                interval: stockDataRequestDto.interval,
                timestamp: Between(stockDataRequestDto.startDate, stockDataRequestDto.endDate)
            },
            order: {
                timestamp: 1
            }
        });
    }

    async findOne(id: string): Promise<StockData> {
        return await this.stockDataRepository.findOne(id);
    }

    async remove(id: string): Promise<DeleteResult> {
        return await this.stockDataRepository.delete(id);
    }
}
