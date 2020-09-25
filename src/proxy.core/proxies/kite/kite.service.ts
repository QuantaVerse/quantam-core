import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { DataProxyInterface } from "../proxy/data.proxy.interface";
import { DataProxyService } from "../proxy/data.proxy.service";
import { KiteAPI } from "./kite.api";
import { IKiteAPI } from "./kite.interface";

@Injectable()
export class KiteService extends DataProxyService implements DataProxyInterface {
    private readonly _kiteAPI: IKiteAPI;

    constructor(private configService: ConfigService, proxyJobLogService: ProxyJobLogService) {
        super(proxyJobLogService);
        this.PROXY_NAME = "Kite";
        this.API_KEY_NAME = "PROXY_APIKEY_KITE";
        this.API_KEY = this.configService.get<string>(this.API_KEY_NAME);

        this._kiteAPI = new KiteAPI(proxyJobLogService, this.API_KEY, true);
    }

    async pingProxyHealth(): Promise<any> {
        return await this._kiteAPI.getHealth();
    }
}
