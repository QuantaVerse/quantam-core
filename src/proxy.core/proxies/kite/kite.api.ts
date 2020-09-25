import { Logger } from "@nestjs/common";
import axios from "axios";
import { KiteConnect } from "kiteconnect";

import { ProxyJobLogService } from "../../../db/service/proxy.job.log.service";
import { buildUrl } from "../../../util/build.url";
import { IKiteAPI } from "./kite.interface";

export class KiteAPI implements IKiteAPI {
    private readonly proxyJobLogService: ProxyJobLogService;
    private readonly baseUrl: string = "https://api.kite.trade";
    private readonly apiKey: string;
    private readonly verbose: boolean;
    private readonly kiteConnect: KiteConnect;

    constructor(proxyJobLogService: ProxyJobLogService, apiKey: string, verbose: boolean | undefined) {
        this.proxyJobLogService = proxyJobLogService;
        this.apiKey = apiKey;
        this.verbose = verbose !== undefined ? verbose : false;
        this.kiteConnect = new KiteConnect({ api_key: "your_api_key" });
    }

    async getHealth(): Promise<any> {
        const url: string = buildUrl(this.baseUrl);
        this.verbose && Logger.log("KiteAPI : getHealth url >> " + url);
        return await axios.get(url);
    }

    // kc = new KiteConnect({
    //     api_key: "your_api_key"
    // });
    //
    // kc.generateSession("request_token", "api_secret").then(function(response) {
    //     init();
    // }).catch(function(err) {
    //     console.log(err);
    // });
    //
    // function init() {
    //     // Fetch equity margins.
    //     // You can have other api calls here.
    //     kc.getMargins()
    //         .then(function(response) {
    //             // You got user's margin details.
    //         }).catch(function(err) {
    //         // Something went wrong.
    //     });
    // }
}
