/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class SaveBookInput {
    title: string;
    author: string;
    isbn: string;
    link?: Nullable<string>;
    publisher?: Nullable<string>;
    pubDate?: Nullable<string>;
    description?: Nullable<string>;
    imageUrl?: Nullable<string>;
}

export class ToggleLikeInput {
    bookId: string;
}

export class CreateNoteInput {
    bookId: string;
    content: string;
}

export class UpdateNoteInput {
    content?: Nullable<string>;
}

export class Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    link?: Nullable<string>;
    publisher?: Nullable<string>;
    pubDate?: Nullable<string>;
    description?: Nullable<string>;
    imageUrl?: Nullable<string>;
    isLiked?: Nullable<boolean>;
}

export abstract class IQuery {
    abstract getAllBooks(): Book[] | Promise<Book[]>;

    abstract getNotesByBook(bookId: string): Note[] | Promise<Note[]>;

    abstract getNoteById(noteId: string): Note | Promise<Note>;
}

export abstract class IMutation {
    abstract saveBook(input: SaveBookInput): Book | Promise<Book>;

    abstract toggleLike(input: ToggleLikeInput): boolean | Promise<boolean>;

    abstract createNote(input: CreateNoteInput): Note | Promise<Note>;

    abstract updateNote(noteId: string, input: UpdateNoteInput): Note | Promise<Note>;
}

export class User {
    id: string;
}

export class Note {
    id: string;
    content: string;
    book: Book;
    user: User;
}

type Nullable<T> = T | null;
