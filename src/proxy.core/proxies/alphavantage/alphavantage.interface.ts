export declare type OutputSize = "full" | "compact" | string;

export class AlphavantageProxyConfig {
    preferredDataType: string;
    preferredOutputSize: string;

    constructor(preferredDataType: string, preferredOutputSize: string) {
        this.preferredDataType = preferredDataType;
        this.preferredOutputSize = preferredOutputSize;
    }
}
