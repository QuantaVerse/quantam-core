import { HttpException, HttpStatus } from "@nestjs/common";

import { DataRetrieverJobDto } from "../../../retriever/dto/request/data-retriever-job.dto";
import { DataRetrieverJobResponseDto } from "../../../retriever/dto/response/data-retriever-job-response.dto";
import { DataProxyInterface } from "./data.proxy.interface";
import { DataProxyStats } from "./data.proxy.stats";

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
        throw new HttpException(
            `DataProxy '${this.PROXY_NAME}' has not implemented this method`,
            HttpStatus.BAD_REQUEST
        );
    }
}
