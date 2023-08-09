class ParserError extends Error {
}
class AuthorizationError extends Error {
}
class ClientError extends Error {
}
class LengthError extends Error {
}
class RateLimitError extends Error {
}
class ServiceQuotaError extends Error {
}
class ServerError extends Error {
}
class AvailabilityError extends Error {
}
class AbortError extends Error {
}
export {
  AbortError,
  AuthorizationError,
  AvailabilityError,
  ClientError,
  LengthError,
  ParserError,
  RateLimitError,
  ServerError,
  ServiceQuotaError
};
