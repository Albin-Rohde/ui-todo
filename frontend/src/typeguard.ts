import { RestError, RestValidationError } from './types';

export function isValidationError(err: RestError | RestValidationError | undefined): err is RestValidationError {
  if (!err) return false;
  return err.name === 'ValidationError';
}