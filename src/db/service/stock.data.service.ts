import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";
import { InsertResult } from "typeorm/query-builder/result/InsertResult";

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

    async findAll(): Promise<StockData[]> {
        return await this.stockDataRepository.find();
    }

    async findOne(id: string): Promise<StockData> {
        return await this.stockDataRepository.findOne(id);
    }

    async remove(id: string): Promise<DeleteResult> {
        return await this.stockDataRepository.delete(id);
    }
}
