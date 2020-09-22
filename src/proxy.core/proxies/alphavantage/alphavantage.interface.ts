import { DailyBar, IntraDayBar } from "../../../common/interfaces/data.interface";

export enum OutputSize {
    Full = "full",
    Compact = "compact"
}

export enum DataType {
    CSV = "csv",
    JSON = "json"
}

export class AlphavantageProxyConfig {
    preferredDataType: string;
    preferredOutputSize: string;

    constructor(preferredDataType: DataType | undefined, preferredOutputSize: OutputSize | undefined) {
        this.preferredDataType = preferredDataType !== undefined ? preferredDataType : DataType.JSON;
        this.preferredOutputSize = preferredOutputSize !== undefined ? preferredOutputSize : OutputSize.Compact;
    }
}

export interface IAlphavantageAPI {
    getHealth(): Promise<any>;
    getIntraDayData(symbol: string, interval: string): Promise<IntraDayBar[]>;
    getDailyData(symbol: string, interval: string): Promise<DailyBar[]>;
}
