import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";

import { DataRetrieverJobDto } from "../../../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "../../../retriever/dto/response/data-retriever-job-response.dto";
import { DataProxyInterface } from "./data.proxy.interface";
import { DataProxyStats } from "./data.proxy.stats";

@Injectable()
export class DataProxyService implements DataProxyInterface {
    protected PROXY_NAME: string;
    protected API_KEY_NAME: string;
    protected API_KEY: string;

    getProxyStats(): DataProxyStats {
        return {
            name: this.PROXY_NAME,
            api_key_name: this.API_KEY_NAME
        };
    }

    retrieveIntraDayData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto {
        const message = `retrieveIntraDayData : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
        Logger.warn(message);
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    async saveIntraDayDataToDb(symbol: string, interval: number, data: any[]): Promise<void> {
        const message = `saveIntraDayDataToDb : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
        Logger.warn(message);
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    retrieveDailyData(dataRetrieverJobDto: DataRetrieverJobDto): DataRetrieverJobResponseDto {
        const message = `retrieveDailyData : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
        Logger.warn(message);
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    saveDailyDataToDb(symbol: string, interval: number, data: any[]): Promise<void> {
        const message = `saveDailyDataToDb : DataProxy '${this.PROXY_NAME}' has not implemented this method`;
        Logger.warn(message);
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
}
