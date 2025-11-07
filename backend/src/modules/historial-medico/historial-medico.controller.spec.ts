import { Test, TestingModule } from '@nestjs/testing';
import { HistorialMedicoController } from './historial-medico.controller';

describe('HistorialMedicoController', () => {
  let controller: HistorialMedicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialMedicoController],
    }).compile();

    controller = module.get<HistorialMedicoController>(HistorialMedicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
