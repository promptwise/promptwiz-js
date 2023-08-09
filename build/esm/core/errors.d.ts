export declare class ParserError extends Error {
}
export declare class AuthorizationError extends Error {
}
export declare class ClientError extends Error {
}
export declare class LengthError extends Error {
}
export declare class RateLimitError extends Error {
}
export declare class ServiceQuotaError extends Error {
}
export declare class ServerError extends Error {
}
export declare class AvailabilityError extends Error {
}
export declare class AbortError extends Error {
}
export type FallbackErrors = "AvailabilityError" | "LengthError" | "ParserError" | "RateLimitError" | "ServerError" | "ServiceQuotaError";
