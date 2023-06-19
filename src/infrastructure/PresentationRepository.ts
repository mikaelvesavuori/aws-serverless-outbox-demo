import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput
  //TransactWriteItemsCommand,
  //TransactWriteItemsCommandInput
} from '@aws-sdk/client-dynamodb';

import { DynamoItem } from '../interfaces/DynamoDb';

import { getCleanedItems } from '../application/getCleanedItems';

import { MissingEnvVarsError } from '../errors/MissingEnvVarsError';

/**
 * @description Factory function to create a new repository for presented books.
 */
export function createNewPresentationRepository() {
  return new PresentationRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
class PresentationRepository {
  docClient: DynamoDBClient;
  tableName: string;
  region: string;

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
   * @description Add (create/update) information on a recently presented book to the database.
   */
  public async add(id: string): Promise<void> {
    // Eventually consistent solution: Cheaper but could possibly be incorrect if a read happens extremely shortly after writing
    const command: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        pk: { S: id },
        expiresAt: { N: this.getExpiryTime() }
      }
    };

    if (process.env.NODE_ENV !== 'test') await this.docClient.send(new PutItemCommand(command));

    // Strongly consistent solution: More expensive but safer as a read should always use the updated information
    /*
    const command: TransactWriteItemsCommandInput = {
      TransactItems: [
        {
          Put: {
            TableName: this.tableName,
            Item: {
              pk: { S: id },
              expiresAt: { N: this.getExpiryTime() }
            }
          }
        }
      ]
    };

    if (process.env.NODE_ENV !== 'test')
      await this.docClient.send(new TransactWriteItemsCommand(command));
  */
  }

  /**
   * @description Get information on a recently presented book from the database.
   */
  public async get(id: string) {
    const command: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: id }
      }
    };

    const data = (await this.docClient.send(new QueryCommand(command))) as any;
    return getCleanedItems(data.Items as DynamoItem[]);
  }

  /**
   * @description Get a TTL (expiration) value that works with DynamoDB.
   */
  private getExpiryTime(ttlInSeconds = 300) {
    const timestamp = Math.floor(Date.now() / 1000);
    return (timestamp + ttlInSeconds).toString();
  }
}
