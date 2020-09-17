import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { QuantamCoreModule } from "../../src/quantam.core.module";

describe("QuantamCoreController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [QuantamCoreModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/health (GET)", () => {
        return request(app.getHttpServer())
            .get("/health")
            .expect(200);
    });
});
