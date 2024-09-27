export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  link?: string;
  publisher?: string;
  pubDate?: Date;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type Note = {
  id: string;
  userId: string;
  bookId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type SharedBookResponse = {
  book: Book;
  notes: Note[];
};
