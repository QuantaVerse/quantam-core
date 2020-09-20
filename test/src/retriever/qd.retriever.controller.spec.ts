import { Test, TestingModule } from "@nestjs/testing";

import { QuantamDataRetrieverController } from "../../../src/retriever/qd.retriever.controller";
import { qd_retriever_module_metadata } from "../../../src/retriever/qd.retriever.module";

describe("QuantamDataRetrieverControllerTest", () => {
    let retrieverController: QuantamDataRetrieverController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule(qd_retriever_module_metadata).compile();
        retrieverController = app.get<QuantamDataRetrieverController>(QuantamDataRetrieverController);
    });

    describe("health_controller", () => {
        it("should return health of retriever as UP", () => {
            const health = retrieverController.getHealth();
            expect(Object.keys(health).includes("status"));
            expect(health["status"]).toBe("OK");
        });
    });
});
