import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";

import { quantam_core_module_metadata } from "../../src/quantam.core.module";

describe("QuantamCoreController (e2e)", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule(quantam_core_module_metadata).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/health (GET)", () => {
        return request(app.getHttpServer()).get("/health").expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});
