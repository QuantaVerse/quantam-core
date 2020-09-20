import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";

import { DataRetrieverJobDto } from "../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "../retriever/dto/response/data-retriever-job-response.dto";
import { AlphaVantageService } from "./proxies/alphavantage/alphavantage.service";
import { KiteService } from "./proxies/kite/kite.service";
import { MarketStackService } from "./proxies/marketstack/marketstack.service";
import { DataProxyInterface } from "./proxies/proxy/data.proxy.interface";
import { DataProxyStats } from "./proxies/proxy/data.proxy.stats";
import { ProxyManagerInterface } from "./proxy.manager.interface";

@Injectable()
export class ProxyManagerService implements ProxyManagerInterface {
    private readonly _proxyServices: Record<string, DataProxyInterface>;

    constructor(
        private alphaVantageService: AlphaVantageService,
        private kiteService: KiteService,
        private marketStackService: MarketStackService
    ) {
        this._proxyServices = {
            alphavantage: alphaVantageService,
            kite: kiteService,
            marketstack: marketStackService
        };
    }

    createDataRetrieverJob(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto {
        Logger.log("dataRetrieverJobDto " + JSON.stringify(dataRetrieverJobDto));
        const proxyName: string | undefined = dataRetrieverJobDto.proxy?.toLowerCase();
        if (!!proxyName) {
            if (this._proxyServices.hasOwnProperty(proxyName)) {
                return this._proxyServices[proxyName].retrieveIntraDayData(dataRetrieverJobDto);
            } else {
                throw new HttpException("Proxy not found", HttpStatus.BAD_REQUEST);
            }
        } else {
            // TODO: select based on current details
            // select default proxy
            return this._proxyServices.alphavantage.retrieveIntraDayData(dataRetrieverJobDto);
        }
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
