import { Injectable, Logger } from "@nestjs/common";

import { QuantamDataRetrieverServiceInterface } from "./qd.retriever.interface";

@Injectable()
export class QuantamDataRetrieverService implements QuantamDataRetrieverServiceInterface {
    getHealth(): Record<string, string> {
        Logger.log("getHealth service call");
        return {
            status: "OK",
            message: "Quantam Data Retriever is up!"
        };
    }
}
