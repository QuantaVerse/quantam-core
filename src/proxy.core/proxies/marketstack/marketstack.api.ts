import { IMarketStackAPI } from "./marketstack.interface";

export class MarketStackAPI implements IMarketStackAPI {
    getHealth(): Promise<any> {
        // TODO: implement wrong api to test log negative flow
        // TODO: implement correct api
        return Promise.resolve(undefined);
    }
}
