import test from 'ava';

import { Book } from '../../../src/domain/Book';

const input = {
  name: 'Team Topologies',
  authors: ['Manuel Pais', 'Matthew Skelton'],
  year: 2019
};

test('It should create a new, valid Book entity', (t) => {
  const book = new Book(input);
  const dto = book.getDTO();
  t.deepEqual(dto, input);
});
