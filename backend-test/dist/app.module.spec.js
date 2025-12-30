"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("./app.module");
describe('AppModule', () => {
    it('should have required imports', () => {
        expect(app_module_1.AppModule).toBeDefined();
        expect(typeof app_module_1.AppModule).toBe('function');
    });
});
//# sourceMappingURL=app.module.spec.js.map