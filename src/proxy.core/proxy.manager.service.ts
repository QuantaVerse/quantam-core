import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";

import { AlphaVantageService } from "./proxies/alphavantage/alphavantage.service";
import { DataRetrievalJobDto } from "./proxies/dto/request/data-retrieval-job.dto";
import { DataRetrieverJobResponseDto } from "./proxies/dto/response/data-retriever-job-response.dto";
import { KiteService } from "./proxies/kite/kite.service";
import { MarketStackService } from "./proxies/marketstack/marketstack.service";
import { DataProxyInterface, DataProxyStats } from "./proxies/proxy/data.proxy.interface";
import { ProxyManagerInterface } from "./proxy.manager.interface";

@Injectable()
export class ProxyManagerService implements ProxyManagerInterface {
    private readonly _proxyServices: Record<string, DataProxyInterface>;
    private readonly VALID_INTERVALS = [1, 5, 15, 30, 60, 1440];

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

    async createDataRetrievalJob(
        dataRetrieverJobDto: DataRetrievalJobDto
    ): Promise<DataRetrieverJobResponseDto | HttpException> {
        // TODO: FIX this method with
        Logger.log(
            "ProxyManagerService : createDataRetrievalJob : dataRetrieverJobDto " + JSON.stringify(dataRetrieverJobDto)
        );

        let proxyName: string | undefined = dataRetrieverJobDto.proxy?.toLowerCase();
        if (typeof proxyName === "string" && !this._proxyServices.hasOwnProperty(proxyName)) {
            Logger.warn("createDataRetrievalJob : Proxy not found : HttpStatus.BAD_REQUEST");
            throw new HttpException("Proxy not found", HttpStatus.BAD_REQUEST);
        } else if (proxyName === undefined) {
            // TODO: select based on current details
            // select default proxy from config
            proxyName = "alphavantage";
        }

        const interval: number | undefined = dataRetrieverJobDto.interval;
        if (interval !== undefined && this.VALID_INTERVALS.includes(interval)) {
            if (interval === 1440) {
                this._proxyServices[proxyName].retrieveDailyData(dataRetrieverJobDto);
            } else {
                this._proxyServices[proxyName].retrieveIntraDayData(dataRetrieverJobDto);
            }
            return new DataRetrieverJobResponseDto("001");
        } else {
            Logger.warn("createDataRetrievalJob : Given interval is invalid : HttpStatus.BAD_REQUEST");
            throw new HttpException("Given interval is invalid", HttpStatus.BAD_REQUEST);
        }
        return new DataRetrieverJobResponseDto("001");
    }

    getProxies(): Record<string, DataProxyStats> {
        Logger.log("ProxyManagerService : getProxies");
        const proxyStats: Record<string, DataProxyStats> = {};
        for (const proxyName in this._proxyServices) {
            if (this._proxyServices.hasOwnProperty(proxyName)) {
                proxyStats[proxyName] = this._proxyServices[proxyName].getProxyStats();
            }
        }
        return proxyStats;
    }

    getProxyDetails(proxyName: string): DataProxyStats {
        Logger.log(`ProxyManagerService : getProxyDetails for proxy with name='${proxyName}'`);
        if (this._proxyServices.hasOwnProperty(proxyName.toLowerCase())) {
            return this._proxyServices[proxyName.toLowerCase()].getProxyStats();
        } else {
            const message = `Proxy with name '${proxyName.toLowerCase()}' not found`;
            Logger.warn(`getProxyDetails : ${message} : HttpStatus.BAD_REQUEST`);
            throw new HttpException(message, HttpStatus.BAD_REQUEST);
        }
    }
}
