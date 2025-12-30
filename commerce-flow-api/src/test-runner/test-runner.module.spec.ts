import { Test } from '@nestjs/testing';
import { TestRunnerModule } from './test-runner.module';

describe('TestRunnerModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [TestRunnerModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should have required components', () => {
    expect(TestRunnerModule).toBeDefined();
    expect(typeof TestRunnerModule).toBe('function');
  });
});
