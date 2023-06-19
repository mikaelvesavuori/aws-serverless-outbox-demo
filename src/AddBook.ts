import { APIGatewayProxyEventV2 } from 'aws-lambda';

import { Book } from './domain/Book';

import { BookDTO } from './interfaces/Book';

import { getBody } from './application/getBody';

import { createNewBookRepository } from './infrastructure/BookRepository';

/**
 * @description Lambda handler for `AddBook` functionality.
 */
export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = getBody(event);

    const book = new Book(body);
    await addBook(book.getDTO());

    return {
      statusCode: 201
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: error.message || 'An error occurred'
    };
  }
}

/**
 * @description Adds a Book to the repository.
 */
export async function addBook(book: BookDTO) {
  const repository = createNewBookRepository();
  await repository.add(book);
}
