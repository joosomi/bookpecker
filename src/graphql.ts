
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
}

export abstract class IMutation {
    abstract saveBook(input: SaveBookInput): Book | Promise<Book>;

    abstract toggleLike(input: ToggleLikeInput): boolean | Promise<boolean>;
}

type Nullable<T> = T | null;
