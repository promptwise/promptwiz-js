import {
  AuthorizationError,
  ClientError,
  RateLimitError,
  ServerError,
  ServiceQuotaError,
  AvailabilityError,
} from "../../errors";

export async function assessMistralResponse(response: Response) {
  if (!response.ok) {
    const responseBody = await response.json();
    const status = response.status;
    const message =
      responseBody.error?.message ||
      responseBody.error?.response ||
      response.statusText;
    switch (status) {
      case 401:
        throw new AuthorizationError(message);
      case 429: {
        if (message.includes("quota")) throw new ServiceQuotaError(message);
        throw new RateLimitError(message);
      }
      case 500:
        throw new ServerError(message);
      case 503:
        throw new AvailabilityError(message);
      default:
        if (status >= 400 && status < 500) throw new ClientError(message);
        throw new Error(message);
    }
  }
  return true;
}
