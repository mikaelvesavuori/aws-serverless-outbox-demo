import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput
} from '@aws-sdk/client-dynamodb';

import { BookDTO } from '../interfaces/Book';

import { MissingEnvVarsError } from '../errors/MissingEnvVarsError';

export function createNewBookRepositoryCDC() {
  return new BookRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
class BookRepository {
  docClient: DynamoDBClient;
  region: string;
  tableName: string;

  constructor() {
    this.region = process.env.REGION || '';
    this.tableName = process.env.TABLE_NAME || '';

    if (!this.region || !this.tableName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: 'REGION', value: process.env.REGION },
          { key: 'TABLE_NAME', value: process.env.TABLE_NAME }
        ])
      );

    this.docClient = new DynamoDBClient({ region: this.region });
  }

  /**
   * @description Add (create/update) a book to the database.
   */
  public async add(book: BookDTO): Promise<void> {
    const { name, authors, year } = book;

    const command: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        name: { S: name },
        authors: { SS: authors },
        publishedYear: { N: year.toString() }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));
  }

  /**
   * @description Remove a book from the database.
   */
  public async remove(bookName: string): Promise<void> {
    const command: DeleteItemCommandInput = {
      TableName: this.tableName,
      Key: {
        name: { S: bookName }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new DeleteItemCommand(command));
  }
}
