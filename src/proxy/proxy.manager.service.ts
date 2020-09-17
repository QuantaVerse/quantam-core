import { ProxyManagerInterface } from "./interfaces/proxy.manager.interface";
import { Injectable } from "@nestjs/common";
import { CreateRetrieverJobDto } from "../retriever/dto/request/create-retriever-job.dto";

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
