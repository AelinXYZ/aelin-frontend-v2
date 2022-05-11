export function isSuccessful<T>(
  response: PromiseSettledResult<T>,
): response is PromiseFulfilledResult<T> {
  return 'value' in response
}
