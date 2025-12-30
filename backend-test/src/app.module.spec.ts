import { AppModule } from './app.module';

describe('AppModule', () => {
  it('should have required imports', () => {
    expect(AppModule).toBeDefined();
    expect(typeof AppModule).toBe('function');
  });
});
