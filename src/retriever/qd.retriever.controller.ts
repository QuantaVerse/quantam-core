import { Controller, Get } from "@nestjs/common";
import { QuantamDataRetrieverService } from "./qd.retriever.service";

@Controller("retriever")
export class QuantamDataRetrieverController {
    constructor(private readonly dataRetrieverService: QuantamDataRetrieverService) {}

    @Get("health")
    getHealth(): Record<string, string> {
        return this.dataRetrieverService.getHealth();
    }
}
