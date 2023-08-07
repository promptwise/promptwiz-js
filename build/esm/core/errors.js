class ParserError extends Error {
}
class AuthorizationError extends Error {
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
  ParserError,
  RateLimitError,
  ServerError,
  ServiceQuotaError
};
