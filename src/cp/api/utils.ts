import { ErrorResponse, ValidationErrorResponse } from './types'

export const isValidationError = (obj: ErrorResponse | ValidationErrorResponse): obj is ValidationErrorResponse =>
  Object.hasOwn(obj, 'type') && (obj as ValidationErrorResponse).type === 'ARGUMENT_NOT_VALID'
