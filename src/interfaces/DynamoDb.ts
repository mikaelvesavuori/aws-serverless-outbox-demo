/**
 * @description Representation of records in the database.
 */
export type DynamoItems = {
  Items: DynamoItem[];
};

/**
 * @description Record in the database.
 */
export type DynamoItem = {
  [key: string]: StringRepresentation;
};

/**
 * @description String that represents the value.
 */
export type StringRepresentation = {
  S: string;
};

/**
 * @description Item from database that has been cleaned and conformed.
 */
export type CleanedItem = {
  team: string;
  timestamp: string;
  changes: string;
};
