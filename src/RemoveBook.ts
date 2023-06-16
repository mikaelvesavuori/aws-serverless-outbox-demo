import { APIGatewayProxyResultV2 } from 'aws-lambda';

import { getBody } from './application/getBody';
import { getName } from './application/getName';

import { createNewBookRepository } from './infrastructure/BookRepository';

/**
 * @description Lambda handler for `RemoveBook` functionality.
 */
export async function handler(event: APIGatewayProxyResultV2) {
  try {
    const body = getBody(event);
    const name = getName(body);

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
