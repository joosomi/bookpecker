import { Test, TestingModule } from '@nestjs/testing';

import { BookSearchController } from './book-search.controller';

describe('BookSearchController', () => {
  let controller: BookSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookSearchController],
    }).compile();

    controller = module.get<BookSearchController>(BookSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
