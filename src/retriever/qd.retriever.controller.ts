import { Body, Controller, Get, Post } from "@nestjs/common";

import { ProxyManagerService } from "../proxy.core/proxy.manager.service";
import { CreateRetrieverJobDto } from "./dto/request/create-retriever-job.dto";
import { QuantamDataRetrieverService } from "./qd.retriever.service";

@Controller("retriever")
export class QuantamDataRetrieverController {
    constructor(
        private readonly dataRetrieverService: QuantamDataRetrieverService,
        private readonly proxyManagerService: ProxyManagerService
    ) {}

    @Get("health")
    getHealth(): Record<string, string> {
        return this.dataRetrieverService.getHealth();
    }

    @Post("createJob")
    pullDataFromProxy(@Body() createRetrieverJobDto: CreateRetrieverJobDto) {
        return this.proxyManagerService.createDataRetrieverJob(createRetrieverJobDto);
    }
}
