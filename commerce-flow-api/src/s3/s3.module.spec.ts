import { Test } from '@nestjs/testing';
import { S3Module } from './s3.module';

describe('S3Module', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [S3Module],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should have required components', () => {
    expect(S3Module).toBeDefined();
    expect(typeof S3Module).toBe('function');
  });
});
