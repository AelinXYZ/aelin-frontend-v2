export class CustomError extends Error {
  statusCode: number
  constructor(msg: string, _statusCode: number) {
    super(msg)
    this.statusCode = _statusCode
  }
}
