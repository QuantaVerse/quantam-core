import { Injectable, Logger } from "@nestjs/common";

import { BunyanLoggerService } from "../logger/logger.service";
import { CreateRetrieverJobDto } from "../retriever/dto/request/create-retriever-job.dto";
import { ProxyManagerInterface } from "./interfaces/proxy.manager.interface";

@Injectable()
export class ProxyManagerService implements ProxyManagerInterface {
    createDataRetrieverJob(createRetrieverJobDto: CreateRetrieverJobDto): void {
        console.log("createDataRetrieverJob");
    }

    getProxies(): Record<string, Record<string, unknown>> {
        return {};
    }

    getProxyDetails(proxyName: string): Record<string, unknown> {
        return {};
    }
}
