import { Test, TestingModule } from "@nestjs/testing";

import { QuantamCoreController } from "../../src/quantam.core.controller";
import { quantam_core_module_metadata } from "../../src/quantam.core.module";
import { QuantamCoreService } from "../../src/quantam.core.service";

describe("QuantamCoreController", () => {
    let coreController: QuantamCoreController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule(quantam_core_module_metadata).compile();

        coreController = app.get<QuantamCoreController>(QuantamCoreController);
    });

    describe("health_controller", () => {
        it("should return health of core as UP", () => {
            const health = coreController.getHealth();
            expect(Object.keys(health).includes("status"));
            expect(health["status"]).toBe("OK");
        });
    });
});
