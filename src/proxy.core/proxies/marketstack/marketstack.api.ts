import { IMarketStackAPI } from "./marketstack.interface";

export class AlphaVantageAPI implements IMarketStackAPI {
    getHealth(): Promise<any> {
        return Promise.resolve(undefined);
    }
}
