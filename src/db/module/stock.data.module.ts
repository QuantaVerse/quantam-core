import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { StockData } from "../entity/stock.data.entity";
import { StockDataService } from "../service/stock.data.service";

@Module({
    imports: [TypeOrmModule.forFeature([StockData])],
    providers: [StockDataService],
    exports: [TypeOrmModule, StockDataService]
})
export class StockDataModule {}
