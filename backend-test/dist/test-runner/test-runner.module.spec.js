"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const test_runner_module_1 = require("./test-runner.module");
describe('TestRunnerModule', () => {
    it('should compile the module', async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [test_runner_module_1.TestRunnerModule],
        }).compile();
        expect(module).toBeDefined();
    });
    it('should have required components', () => {
        expect(test_runner_module_1.TestRunnerModule).toBeDefined();
        expect(typeof test_runner_module_1.TestRunnerModule).toBe('function');
    });
});
//# sourceMappingURL=test-runner.module.spec.js.map