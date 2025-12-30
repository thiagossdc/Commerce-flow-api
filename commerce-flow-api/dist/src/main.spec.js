"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("./app.module");
describe('Main (bootstrap)', () => {
    let app;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider('BullQueue_notificacao')
            .useValue({
            add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
            process: jest.fn(),
            on: jest.fn(),
            close: jest.fn().mockResolvedValue(undefined),
        })
            .compile();
        app = moduleFixture.createNestApplication();
    });
    afterEach(async () => {
        if (app) {
            await app.close();
        }
    });
    it('should bootstrap the application', async () => {
        expect(app).toBeDefined();
        expect(app.getHttpAdapter()).toBeDefined();
    });
});
//# sourceMappingURL=main.spec.js.map