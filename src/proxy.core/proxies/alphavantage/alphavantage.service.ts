import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DataRetrieverJobDto } from "../../../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "../../../retriever/dto/response/data-retriever-job-response.dto";
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

    retrieveIntraDayData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto {
        return this._alphaVantageAPI
            .getIntraDayData(dataRetrieverJobDto.symbol, "15min")
            .then(() => {
                Logger.log("retrieveIntraDayData: success");
            })
            .catch(error => {
                Logger.error("retrieveIntraDayData: error", error);
                if (error.toString().startsWith("Error:")) {
                    throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
                } else {
                    throw new HttpException(error.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
                }
            })
            .finally(() => {
                return new DataRetrieverJobResponseDto("001");
            });
    }
}
