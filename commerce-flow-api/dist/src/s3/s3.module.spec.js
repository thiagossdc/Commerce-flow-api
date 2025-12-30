"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const s3_module_1 = require("./s3.module");
describe('S3Module', () => {
    it('should compile the module', async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [s3_module_1.S3Module],
        }).compile();
        expect(module).toBeDefined();
    });
    it('should have required components', () => {
        expect(s3_module_1.S3Module).toBeDefined();
        expect(typeof s3_module_1.S3Module).toBe('function');
    });
});
//# sourceMappingURL=s3.module.spec.js.map