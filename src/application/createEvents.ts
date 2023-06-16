import { DynamoDBRecord } from 'aws-lambda';

import {
  EventBridgeEvent,
  BookAddedEventDetails,
  BookRemovedEventDetails,
  DetailType
} from '../interfaces/Event';

import { MissingEnvVarsError } from '../errors/MissingEnvVarsError';

/**
 * @description Create a clean dataset with our "event details" from the DynamoDB stream records.
 */
export function createEvents(records: DynamoDBRecord[]): EventBridgeEvent[] {
  if (!records) return [];

  const eventBusName = getEventBusName();
  const filteredRecords = filterOutUselessRecords(records);

  return <EventBridgeEvent[]>filteredRecords.map((record: DynamoDBRecord) => {
    const eventName = record.eventName;
    if (eventName === 'INSERT')
      return produceEventBridgeEvent(cleanAddedInput(record), 'outboxdemo.added', eventBusName);
    else if (eventName === 'REMOVE')
      return produceEventBridgeEvent(cleanRemovedInput(record), 'outboxdemo.removed', eventBusName);
  });
}

/**
 * @description Get the event bus name.
 */
function getEventBusName() {
  const eventBusName = process.env.EVENT_BUS_NAME || '';
  if (!eventBusName)
    throw new MissingEnvVarsError(
      JSON.stringify([{ key: 'EVENT_BUS_NAME', value: process.env.EVENT_BUS_NAME }])
    );

  return eventBusName;
}

/**
 * @description If we get both an insert and removal, it's most likely we want only the insert
 */
function filterOutUselessRecords(records: DynamoDBRecord[]) {
  const eventNames = records.map((record: DynamoDBRecord) => record.eventName);
  const hasBothInsertAndRemoveEvents =
    eventNames.includes('INSERT') && eventNames.includes('REMOVE');

  if (hasBothInsertAndRemoveEvents)
    return records.filter((record: DynamoDBRecord) => record.eventName !== 'REMOVE');

  return records;
}

/**
 * @description Ensures well-shaped format for "added" events.
 */
function cleanAddedInput(record: DynamoDBRecord) {
  const data = record.dynamodb?.NewImage;

  return {
    name: (data?.name?.S as string) || '',
    authors: (data?.authors?.SS as string[]) || [],
    publishedYear: parseInt(data?.publishedYear?.N || '') || 1900
  };
}

/**
 * @description Ensures well-shaped format for "removed" events.
 */
function cleanRemovedInput(record: DynamoDBRecord) {
  const data = record.dynamodb?.Keys;

  return {
    name: (data?.name?.S as string) || ''
  };
}

/**
 * @description Compose our event details into the format expected by EventBridge.
 */
function produceEventBridgeEvent(
  eventDetails: BookAddedEventDetails | BookRemovedEventDetails,
  detailType: DetailType,
  eventBusName: string
) {
  return {
    EventBusName: eventBusName,
    Source: 'outboxdemo.processor',
    DetailType: detailType,
    Detail: JSON.stringify(eventDetails)
  };
}
