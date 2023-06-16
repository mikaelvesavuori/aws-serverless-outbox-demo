/**
 * @description Lambda handler for `BookAdded`, which simply
 * responds with a message with the book that was added.
 */
export async function handler(event: Record<string, any>) {
  const bookName = event?.name || event?.detail?.name || 'Unknown book';
  console.log(`${bookName} was added!`);
}
