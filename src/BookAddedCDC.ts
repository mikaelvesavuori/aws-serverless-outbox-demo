export async function handler(event: Record<string, any>) {
  const bookName = event?.name || event?.detail?.name || 'Unknown book';
  console.log(`${bookName} was added!`);
}
