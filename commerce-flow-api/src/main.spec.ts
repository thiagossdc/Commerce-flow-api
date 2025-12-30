import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

describe('Main (bootstrap)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('BullQueue_notificacao')
      .useValue({
        add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
        process: jest.fn(),
        on: jest.fn(),
        close: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    app = moduleFixture.createNestApplication();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should bootstrap the application', async () => {
    // Testa que a aplicação pode ser criada e configurada
    expect(app).toBeDefined();
    expect(app.getHttpAdapter()).toBeDefined();
  });
});
