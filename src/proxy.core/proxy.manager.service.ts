import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";

import { CreateRetrieverJobDto } from "../retriever/dto/request/create-retriever-job.dto";
import { KiteService } from "./proxies/kite/kite.service";
import { MarketStackService } from "./proxies/marketstack/marketstack.service";
import { DataProxyInterface } from "./proxies/proxy/data.proxy.interface";
import { DataProxyStats } from "./proxies/proxy/data.proxy.stats";
import { ProxyManagerInterface } from "./proxy.manager.interface";

@Injectable()
export class ProxyManagerService implements ProxyManagerInterface {
    private readonly _proxyServices: Record<string, DataProxyInterface>;

    constructor(private marketStackService: MarketStackService, private kiteService: KiteService) {
        this._proxyServices = {
            marketstack: marketStackService,
            kite: kiteService
        };
    }

    createDataRetrieverJob(createRetrieverJobDto: CreateRetrieverJobDto): void {
        Logger.log("createDataRetrieverJob " + createRetrieverJobDto);
    }

    getProxies(): Record<string, DataProxyStats> {
        const proxyStats: Record<string, DataProxyStats> = {};
        for (const proxyName in this._proxyServices) {
            if (this._proxyServices.hasOwnProperty(proxyName)) {
                proxyStats[proxyName] = this._proxyServices[proxyName].getProxyStats();
            }
        }
        return proxyStats;
    }

    getProxyDetails(proxyName: string): DataProxyStats {
        if (this._proxyServices.hasOwnProperty(proxyName.toLowerCase())) {
            return this._proxyServices[proxyName.toLowerCase()].getProxyStats();
        } else {
            throw new HttpException(`Proxy with name '${proxyName.toLowerCase()}' not found`, HttpStatus.BAD_REQUEST);
        }
    }
}
