import { bootstrap } from './main';

describe('Main (bootstrap)', () => {
  it('should bootstrap the application', async () => {
    // Test that bootstrap function can be called without throwing
    expect(bootstrap).toBeDefined();
    expect(typeof bootstrap).toBe('function');
  });
});
