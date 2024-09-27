import { Test, TestingModule } from '@nestjs/testing';

import { ShareBookController } from './share-book.controller';

describe('ShareBookController', () => {
  let controller: ShareBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShareBookController],
    }).compile();

    controller = module.get<ShareBookController>(ShareBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
