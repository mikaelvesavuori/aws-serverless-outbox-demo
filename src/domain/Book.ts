import { BookDTO } from '../interfaces/Book';

import { InvalidInputError } from '../errors/InvalidInputError';
import { MissingRequestBodyError } from '../errors/MissingRequestBodyError';

/**
 * @description The Book entity is what we will use throughout this example application.
 */
export class Book {
  readonly name = '';
  readonly authors = [''];
  readonly year = 1900;

  /**
   * @description Creates a basic, valid Book shape.
   */
  constructor(input: Record<string, any>) {
    if (!input) throw new MissingRequestBodyError();

    const name = input.name || '';
    const authors = input.authors || '';
    const year = input.year || '';

    if (!name || !authors || !year)
      throw new InvalidInputError(
        `Invalid input! Please provide "name" (string), "authors" (array of strings), and "year" (number) fields.`
      );

    this.name = name;
    this.authors = authors;
    this.year = year;
  }

  /**
   * @description Get a data transfer object representation of the Book.
   */
  public getDTO(): BookDTO {
    return {
      name: this.name,
      authors: this.authors,
      year: this.year
    };
  }
}
