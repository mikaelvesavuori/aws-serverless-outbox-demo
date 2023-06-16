import { APIGatewayProxyResultV2 } from 'aws-lambda';

import { getBody } from './application/getBody';

import { createNewBookRepository } from './infrastructure/BookRepository';

import { InvalidInputError } from './errors/InvalidInputError';

/**
 * @description Lambda handler for `RemoveBook` functionality.
 */
export async function handler(event: APIGatewayProxyResultV2) {
  try {
    const body = getBody(event);
    const name = (body.name as string) || '';
    if (!name) throw new InvalidInputError(`Missing "name" in input!`);

    await removeBook(name);

    return {
      statusCode: 200,
      body: JSON.stringify('OK')
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: error.message || 'An error occurred'
    };
  }
}

/**
 * @description Removes a Book from the repository.
 */
export async function removeBook(bookName: string) {
  const ddb = createNewBookRepository();
  await ddb.remove(bookName);
}
