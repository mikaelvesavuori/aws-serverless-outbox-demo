import { MikroLog } from 'mikrolog';

/**
 * @description Used when invalid input data is passed into `AddBook`.
 */
export class InvalidInputError extends Error {
  constructor(message: string) {
    super();
    this.name = 'InvalidInputError';
    this.message = message;

    const logger = MikroLog.start();
    logger.error(message);
  }
}
