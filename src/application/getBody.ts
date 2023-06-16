import { APIGatewayProxyResultV2 } from 'aws-lambda';

import { MissingRequestBodyError } from '../errors/MissingRequestBodyError';

/**
 * @description Gets a ready-to-use JSON representation of the POST body.
 */
export function getBody(event: APIGatewayProxyResultV2 | any) {
  const body: Record<string, string | number> =
    typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  if (!body || JSON.stringify(body) === '{}') throw new MissingRequestBodyError();

  return body;
}
