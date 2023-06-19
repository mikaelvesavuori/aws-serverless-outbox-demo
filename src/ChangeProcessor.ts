import { DynamoDBStreamEvent } from 'aws-lambda';

import { EventBridgeEvent } from './interfaces/Event';

import { createEvents } from './application/createEvents';

import { createNewEventBridgeEmitter } from './infrastructure/EventEmitter';

/**
 * @description Lambda handler for `ChangeProcessor`,
 * that acts as "change data capturer" for our service.
 *
 */
export async function handler(event: DynamoDBStreamEvent) {
  const events = createEvents(event.Records);

  await emitEvents(events);

  return {
    statusCode: 200,
    body: JSON.stringify('OK')
  };
}

/**
 * @description Emit the events.
 */
async function emitEvents(entries: EventBridgeEvent[]) {
  const emitter = createNewEventBridgeEmitter();
  await emitter.emit(entries);
}
