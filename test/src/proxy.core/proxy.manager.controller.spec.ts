import { HttpException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { ProxyManagerController } from "../../../src/proxy.core/proxy.manager.controller";
import { proxy_manager_module_metadata } from "../../../src/proxy.core/proxy.manager.module";

describe("ProxyManagerController", () => {
    let proxyManagerController: ProxyManagerController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule(proxy_manager_module_metadata).compile();
        proxyManagerController = app.get<ProxyManagerController>(ProxyManagerController);
    });

    describe("get proxy details for kite proxy", () => {
        it("should receive DataProxyStats", () => {
            const dataProxyStats = proxyManagerController.getProxyDetails("kite");
            expect(dataProxyStats).toHaveProperty("name");
            expect(dataProxyStats["name"].toLowerCase()).toEqual("kite");
        });
    });

    describe("get proxy details for unknown proxy", () => {
        it("should throw HttpException", () => {
            expect(() => proxyManagerController.getProxyDetails("unknown")).toThrowError(HttpException);
        });
    });
});
