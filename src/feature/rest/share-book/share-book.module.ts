import { Module } from '@nestjs/common';

import { ShareBookController } from './share-book.controller';
import { ShareBookService } from './share-book.service';

@Module({
  controllers: [ShareBookController],
  providers: [ShareBookService],
})
export class ShareBookModule {}
