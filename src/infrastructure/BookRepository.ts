import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput
} from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';

import { BookDTO } from '../interfaces/Book';

import { MissingEnvVarsError } from '../errors/MissingEnvVarsError';

export function createNewBookRepository() {
  return new BookRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
class BookRepository {
  docClient: DynamoDBClient;
  region: string;
  booksTableName: string;
  eventsTableName: string;

  constructor() {
    this.region = process.env.REGION || '';
    this.booksTableName = process.env.BOOKS_TABLE_NAME || '';
    this.eventsTableName = process.env.EVENTS_TABLE_NAME || '';

    if (!this.region || !this.booksTableName || !this.eventsTableName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: 'REGION', value: process.env.REGION },
          { key: 'TABLE_NAME', value: process.env.TABLE_NAME },
          { key: 'EVENTS_TABLE_NAME', value: process.env.EVENTS_TABLE_NAME }
        ])
      );

    this.docClient = new DynamoDBClient({ region: this.region });
  }

  /**
   * @description Add (create/update) a book to the database.
   */
  public async add(book: BookDTO): Promise<void> {
    const { name, authors, year } = book;
    const id = randomUUID();
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const command: TransactWriteItemsCommandInput = {
      TransactItems: [
        {
          Put: {
            TableName: this.booksTableName,
            Item: {
              pk: { S: name },
              authors: { SS: authors },
              publishedYear: { N: year.toString() },
              id: { S: id }
            }
          }
        },
        {
          Put: {
            TableName: this.eventsTableName,
            Item: {
              pk: { S: id },
              sk: { S: timestamp },
              eventType: { S: 'BookAdded' },
              eventData: { S: JSON.stringify(book) }
            }
          }
        }
      ]
    };

    if (process.env.NODE_ENV !== 'test')
      await this.docClient.send(new TransactWriteItemsCommand(command));
  }

  /**
   * @description Remove a book from the database.
   */
  public async remove(bookName: string): Promise<void> {
    const command: DeleteItemCommandInput = {
      TableName: this.booksTableName,
      Key: {
        pk: { S: bookName }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new DeleteItemCommand(command));
  }
}
