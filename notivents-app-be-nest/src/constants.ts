export const SUCCESS = 'success'
export const RATE_LIMITED = 'rate_limited'
export const UNAUTHORIZED = 'unauthorized'
export const RESTRICTED_RESOURCE = 'restricted_resource'
export const VALIDATION_ERROR = 'validation_error'

export type NotionStatus =
  | typeof SUCCESS
  | typeof RATE_LIMITED
  | typeof UNAUTHORIZED
  | typeof RESTRICTED_RESOURCE
  | typeof VALIDATION_ERROR
