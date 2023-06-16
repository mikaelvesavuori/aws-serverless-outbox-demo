import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { EventBridgeEvent } from '../interfaces/Event';

import { MissingEnvVarsError } from '../errors/MissingEnvVarsError';

/**
 * @description Factory function to return freshly minted EventBridge instance.
 */
export const createNewEventBridgeEmitter = () => {
  return new EventBridgeEmitter();
};

/**
 * @description An EventBridge implementation of the `EventEmitter`.
 */
class EventBridgeEmitter {
  private readonly eventBridge: EventBridgeClient;

  constructor() {
    const region = process.env.REGION || '';
    if (!region)
      throw new MissingEnvVarsError(JSON.stringify([{ key: 'REGION', value: process.env.REGION }]));
    this.eventBridge = new EventBridgeClient({ region: process.env.REGION || '' });
  }

  /**
   * @description Utility to emit events with the AWS EventBridge library.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html
   * @see https://www.npmjs.com/package/@aws-sdk/client-eventbridge
   */
  public async emit(entries: EventBridgeEvent[]): Promise<void> {
    const command = new PutEventsCommand({ Entries: entries });
    if (process.env.NODE_ENV !== 'test') await this.eventBridge.send(command);
  }
}
