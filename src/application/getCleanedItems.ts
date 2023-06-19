import { DynamoItem, CleanedItem } from '../interfaces/DynamoDb';

/**
 * @description Clean up and return items in a normalized `CleanedItem` format.
 */
export function getCleanedItems(items: DynamoItem[]): CleanedItem[] {
  if (items && items.length > 0) return items.map((item: DynamoItem) => createCleanedItem(item));
  return [];
}

/**
 * @description Produce an object with a cleaned and restored format based on the input data.
 */
function createCleanedItem(item: DynamoItem): CleanedItem {
  const cleanedItem: Record<string, any> = {};

  Object.entries(item).forEach((entry: any) => {
    const [key, value] = entry;
    cleanedItem[key] = Object.values(value)[0];
  });

  return cleanedItem as CleanedItem;
}
