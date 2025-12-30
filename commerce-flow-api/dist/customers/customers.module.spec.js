"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customers_module_1 = require("./customers.module");
describe('CustomersModule', () => {
    it('should have required components', () => {
        expect(customers_module_1.CustomersModule).toBeDefined();
        expect(typeof customers_module_1.CustomersModule).toBe('function');
    });
});
//# sourceMappingURL=customers.module.spec.js.map