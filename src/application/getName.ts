import { InvalidInputError } from '../errors/InvalidInputError';

export function getName(body: Record<string, any>) {
  const name = (body.name as string) || '';
  if (!name) throw new InvalidInputError(`Missing "name" in input!`);

  return name;
}
