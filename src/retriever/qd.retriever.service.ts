import {Injectable} from "@nestjs/common";

@Injectable()
export class QuantamDataRetrieverService {
    getHealth(): Record<string, string> {
        return {
            status: "OK",
            message: 'Quantam Data Retriever is up!'
        };
    }
}