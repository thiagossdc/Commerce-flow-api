import { Test, TestingModule } from '@nestjs/testing';
import { TestRunnerController } from './test-runner.controller';

describe('TestRunnerController', () => {
  let controller: TestRunnerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestRunnerController],
    }).compile();

    controller = module.get<TestRunnerController>(TestRunnerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return HTML for test runner page', () => {
    const result = controller.getTestRunner();
    expect(result).toContain('CommerceFlow');
    expect(result).toContain('Painel de Controle da API');
    expect(result).toContain('Documentação Swagger');
    expect(result).toContain('Executar Testes Unitários');
    expect(result).toContain('<!DOCTYPE html>');
  });

  it('should have runTests method', () => {
    expect(controller.runTests).toBeDefined();
    expect(typeof controller.runTests).toBe('function');
  });
});
