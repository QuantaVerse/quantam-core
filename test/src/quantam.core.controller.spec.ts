import { Test, TestingModule } from '@nestjs/testing';
import { QuantamCoreController } from '../../src/quantam.core.controller';
import { QuantamCoreService } from '../../src/quantam.core.service';

describe('QuantamCoreController', () => {
    let coreController: QuantamCoreController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [QuantamCoreController],
            providers: [QuantamCoreService],
        }).compile();

        coreController = app.get<QuantamCoreController>(QuantamCoreController);
    });

    describe('root', () => {
        it('should return health of core as UP', () => {
            let health = coreController.getHealth();
            expect(health).toBeInstanceOf(Object);
            expect(Object.keys(health).includes("status"));
            expect(health["status"]).toBe("OK");
        });
    });
});
