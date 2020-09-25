import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { DataProxyInterface } from "../proxy/data.proxy.interface";
import { DataProxyService } from "../proxy/data.proxy.service";
import { MarketStackAPI } from "./marketstack.api";
import { IMarketStackAPI } from "./marketstack.interface";

@Injectable()
export class MarketStackService extends DataProxyService implements DataProxyInterface {
    private readonly _marketStackAPI: IMarketStackAPI;

    constructor(private configService: ConfigService, proxyJobLogService: ProxyJobLogService) {
        super(proxyJobLogService);
        this.PROXY_NAME = "MarketStack";
        this.API_KEY_NAME = "PROXY_APIKEY_MARKET_STACK";
        this.API_KEY = this.configService.get<string>(this.API_KEY_NAME);

        this._marketStackAPI = new MarketStackAPI(proxyJobLogService, this.API_KEY, true);
    }

    pingProxyHealth(): Promise<any> {
        return this._marketStackAPI.getHealth();
    }
}
