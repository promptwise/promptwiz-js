
export class ParserError extends Error {
  // Parser failed to successfully parse the model output
}

export class AuthorizationError extends Error {
  // User is missing generate key or is using invalid generate key
}

export class RateLimitError extends Error {
  // Model provider is rate limiting us
}

export class ServiceQuotaError extends Error {
  // Full service quota with provider has been exhausted for this billing period
}

export class ServerError extends Error {
  // Unexpected error from provider's servers
}

export class AvailabilityError extends Error {
  // Providers services are unavailable due to overload
}

export class AbortError extends Error {}
