import { EventBridgeEvent } from 'aws-lambda';

/**
 * @description Lambda handler for `BookRemoved`, which simply
 * responds with a message with the book that was removed.
 */
export async function handler(event: EventBridgeEvent<any, any>) {
  const bookName = event?.detail?.name || 'Unknown book';
  console.log(`${bookName} was removed!`);
}
