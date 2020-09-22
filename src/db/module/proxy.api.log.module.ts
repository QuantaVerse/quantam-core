import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProxyApiLog } from "../entity/proxy.api.log.entity";
import { ProxyApiLogService } from "../service/proxy.api.log.service";

@Module({
    imports: [TypeOrmModule.forFeature([ProxyApiLog])],
    providers: [ProxyApiLogService],
    exports: [TypeOrmModule, ProxyApiLogService]
})
export class ProxyApiLogModule {}
