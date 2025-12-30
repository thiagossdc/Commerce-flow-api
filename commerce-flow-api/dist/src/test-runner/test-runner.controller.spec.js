"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const test_runner_controller_1 = require("./test-runner.controller");
describe('TestRunnerController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [test_runner_controller_1.TestRunnerController],
        }).compile();
        controller = module.get(test_runner_controller_1.TestRunnerController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should return HTML for test runner page', () => {
        const result = controller.getTestRunner();
        expect(result).toContain('CommerceFlow');
        expect(result).toContain('Painel de Controle da API');
        expect(result).toContain('Documentação Swagger');
        expect(result).toContain('Executar Testes Unitários');
        expect(result).toContain('<!DOCTYPE html>');
    });
    it('should have runTests method', () => {
        expect(controller.runTests).toBeDefined();
        expect(typeof controller.runTests).toBe('function');
    });
});
//# sourceMappingURL=test-runner.controller.spec.js.map