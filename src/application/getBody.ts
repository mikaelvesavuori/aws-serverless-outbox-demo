/**
 * @description Gets a ready-to-use JSON representation of the POST body.
 */
export function getBody(event: any) {
  const isBase64Encoded = event?.isBase64Encoded;
  if (!isBase64Encoded) return typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  const decodedBody = decodeURIComponent(bufferToString(event.body));
  return JSON.parse(decodedBody);
}

const bufferToString = (input: string) => Buffer.from(input, 'base64').toString();
