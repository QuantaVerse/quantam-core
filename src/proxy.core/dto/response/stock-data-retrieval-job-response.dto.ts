import { ProxyJobLog } from "../../../db/entity/proxy.job.log.entity";

export class StockDataRetrievalJobResponseDto {
    proxyJobLog: ProxyJobLog;

    constructor(proxyJobLog: ProxyJobLog) {
        this.proxyJobLog = proxyJobLog;
    }
}
