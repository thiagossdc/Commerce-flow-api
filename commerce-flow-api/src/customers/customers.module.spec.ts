import { CustomersModule } from './customers.module';

describe('CustomersModule', () => {
  it('should have required components', () => {
    expect(CustomersModule).toBeDefined();
    expect(typeof CustomersModule).toBe('function');
  });
});
