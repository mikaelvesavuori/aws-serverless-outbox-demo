/**
 * @description Specific details/data for "added" events.
 */
export type BookAddedEventDetails = {
  name: string;
  authors: string[];
  publishedYear: number;
};

/**
 * @description Specific details/data for "removed" events.
 */
export type BookRemovedEventDetails = Pick<BookAddedEventDetails, 'name'>;

/**
 * @description The shape of an input into EventBridge.
 */
export type EventBridgeEvent = {
  /**
   * @description Name of the EventBridge bus.
   */
  EventBusName: string;
  /**
   * @description Source of the event.
   */
  Source: string;
  /**
   * @description The type of event.
   */
  DetailType: DetailType;
  /**
   * @description Input data as string.
   */
  Detail: string;
};

export type DetailType = 'BookAdded' | 'BookRemoved';
