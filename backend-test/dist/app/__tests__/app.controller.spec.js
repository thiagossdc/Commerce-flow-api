"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_controller_1 = require("../../app.controller");
const app_service_1 = require("../../app.service");
describe('AppController', () => {
    let appController;
    let appService;
    beforeEach(async () => {
        const app = await testing_1.Test.createTestingModule({
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        }).compile();
        appController = app.get(app_controller_1.AppController);
        appService = app.get(app_service_1.AppService);
    });
    describe('root', () => {
        it('should redirect to /test-runner', () => {
            const mockResponse = {
                redirect: jest.fn(),
            };
            appController.getHello(mockResponse);
            expect(mockResponse.redirect).toHaveBeenCalledWith('/test-runner');
        });
    });
});
//# sourceMappingURL=app.controller.spec.js.map