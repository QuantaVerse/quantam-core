import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ProxyJobLog } from "../entity/proxy.job.log.entity";
import { ProxyJobLogService } from "../service/proxy.job.log.service";

@Module({
    imports: [TypeOrmModule.forFeature([ProxyJobLog])],
    providers: [ProxyJobLogService],
    exports: [TypeOrmModule, ProxyJobLogService]
})
export class ProxyJobLogModule {}
