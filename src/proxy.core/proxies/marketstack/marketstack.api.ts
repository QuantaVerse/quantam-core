import { Logger } from "@nestjs/common";
import axios from "axios";

import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { buildUrl } from "../../../util/build.url";
import { IMarketStackAPI } from "./marketstack.interface";

export class MarketStackAPI implements IMarketStackAPI {
    private readonly proxyJobLogService: ProxyJobLogService;
    private readonly baseUrl: string = "http://api.marketstack.com";
    private readonly apiKey: string;
    private readonly verbose: boolean;

    constructor(proxyJobLogService: ProxyJobLogService, apiKey: string, verbose: boolean | undefined) {
        this.proxyJobLogService = proxyJobLogService;
        this.apiKey = apiKey;
        this.verbose = verbose !== undefined ? verbose : false;
    }

    async getHealth(): Promise<any> {
        const demoAPIKey = "demo";
        const url: string = buildUrl(this.baseUrl, {
            path: "v1/eod",
            queryParams: {
                access_key: demoAPIKey
            }
        });
        this.verbose && Logger.log("MarketStackAPI : getHealth url >> " + url);
        return await axios.get(url);
    }
}
