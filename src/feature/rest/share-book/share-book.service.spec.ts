import { Test, TestingModule } from '@nestjs/testing';

import { ShareBookService } from './share-book.service';

describe('ShareBookService', () => {
  let service: ShareBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShareBookService],
    }).compile();

    service = module.get<ShareBookService>(ShareBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
