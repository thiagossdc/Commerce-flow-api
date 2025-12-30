"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
describe('Main (bootstrap)', () => {
    it('should bootstrap the application', async () => {
        expect(main_1.bootstrap).toBeDefined();
        expect(typeof main_1.bootstrap).toBe('function');
    });
});
//# sourceMappingURL=main.spec.js.map