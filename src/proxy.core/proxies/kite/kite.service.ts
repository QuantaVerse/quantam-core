import { Injectable } from "@nestjs/common";

import { DataProxyInterface } from "../proxy/data.proxy.interface";
import { DataProxyService } from "../proxy/data.proxy.service";
import { DataProxyStats } from "../proxy/data.proxy.stats";

@Injectable()
export class KiteService extends DataProxyService implements DataProxyInterface {
    getProxyStats(): DataProxyStats {
        return {
            name: "Kite"
        };
    }
}
