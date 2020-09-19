import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DataRetrieverJobDto } from "../../../retriever/dto/request/data-retriever-job.dto";
import { DataProxyInterface } from "../proxy/data.proxy.interface";
import { DataProxyService } from "../proxy/data.proxy.service";
import { AlphaVantageAPI } from "./alphavantage.api";

@Injectable()
export class AlphaVantageService extends DataProxyService implements DataProxyInterface {
    private _alphaVantageAPI;

    constructor(private configService: ConfigService) {
        super();
        this.PROXY_NAME = "AlphaVantage";
        this.API_KEY_NAME = "PROXY_APIKEY_ALPHA_VANTAGE";
        this.API_KEY = this.configService.get<string>(this.API_KEY_NAME);

        this._alphaVantageAPI = new AlphaVantageAPI(this.API_KEY, "compact", true);
    }

    retrieveIntraDayData(dataRetrieverJobDto: DataRetrieverJobDto) {
        this._alphaVantageAPI
            .getIntraDayData("HDFCBANK.BSE", "15min")
            .then(intraDayData => {
                console.log("IntraDay data:");
                console.log(intraDayData);
            })
            .catch(err => {
                console.error(err);
            });
    }
}
