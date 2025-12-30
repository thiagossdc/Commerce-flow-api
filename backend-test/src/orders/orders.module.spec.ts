import { OrdersModule } from './orders.module';

describe('OrdersModule', () => {
  it('should have required components', () => {
    expect(OrdersModule).toBeDefined();
    expect(typeof OrdersModule).toBe('function');
  });
});
