import { createNewPresentationRepository } from './infrastructure/PresentationRepository';

/**
 * @description Lambda handler for `BookAdded`, which simply
 * responds with a presentational message about the added book.
 * Also checks that it has not presented the same book (and corresponding event) before.
 */
export async function handler(event: Record<string, any>) {
  const { name, year, authors, id } = getDetails(event);
  const repository = createNewPresentationRepository();

  const isPresented = await hasBookBeenPresented(repository, id);

  if (isPresented) console.log('Book has already been presented...');
  else {
    await repository.add(id);
    console.log(`${name} (${year}) by ${authors} was added!`);
  }
}

function getDetails(event: Record<string, any>) {
  const eventData = JSON.parse(event.eventData);

  return {
    name: eventData?.name || 'Unknown book',
    year: eventData?.year || 'Unknown book',
    authors: eventData?.authors || 'Unknown author(s)',
    id: event?.id || ''
  };
}

async function hasBookBeenPresented(repository: any, id: string): Promise<boolean> {
  const response = await repository.get(id);
  return response.length > 0;
}
