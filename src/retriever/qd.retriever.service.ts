import {Injectable} from "@nestjs/common";
import {QuantamDataRetrieverServiceInterface} from "./interfaces/qd.retriever.interface";

@Injectable()
export class QuantamDataRetrieverService implements QuantamDataRetrieverServiceInterface {
    getHealth(): Record<string, string> {
        return {
            status: "OK",
            message: 'Quantam Data Retriever is up!'
        };
    }
}