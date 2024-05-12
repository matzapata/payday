import { Test, TestingModule } from '@nestjs/testing';
import { CashoutsController } from './cashouts.controller';

describe('CashoutsController', () => {
  let controller: CashoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashoutsController],
    }).compile();

    controller = module.get<CashoutsController>(CashoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
