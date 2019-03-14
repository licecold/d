class BaseError extends Error {
  constructor (code, message) {
    super(message)
    this.code = code
    this.message = message
    this.name = 'BaseError'
  }
}

module.exports = BaseError
