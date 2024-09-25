import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { BookSearchController } from './book-search.controller';
import { BookSearchService } from './book-search.service';

@Module({
  imports: [HttpModule],
  controllers: [BookSearchController],
  providers: [BookSearchService],
})
export class BookSearchModule {}
