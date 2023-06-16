/**
 * @description Lambda handler for `BookRemoved`, which simply
 * responds with a message with the book that was removed.
 */
export async function handler(event: Record<string, any>) {
  const bookName = event?.name || event?.detail?.name || 'Unknown book';
  console.log(`${bookName} was removed!`);
}
