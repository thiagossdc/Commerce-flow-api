"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_service_1 = require("../../app.service");
describe('AppService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [app_service_1.AppService],
        }).compile();
        service = module.get(app_service_1.AppService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getHello', () => {
        it('should return "Hello World!"', () => {
            expect(service.getHello()).toBe('Hello World!');
        });
        it('should return a string', () => {
            const result = service.getHello();
            expect(typeof result).toBe('string');
        });
        it('should return the expected greeting message', () => {
            const result = service.getHello();
            expect(result).toBe('Hello World!');
        });
    });
});
//# sourceMappingURL=app.service.spec.js.map