import { Injectable } from "@nestjs/common";

import { DataProxyInterface } from "../proxy/data.proxy.interface";
import { DataProxyStats } from "../proxy/data.proxy.stats";

@Injectable()
export class MarketStackService implements DataProxyInterface {
    getProxyStats(): DataProxyStats {
        return {
            name: "MarketStack"
        };
    }
}
