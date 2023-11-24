import {
  AuthorizationError,
  RateLimitError,
  ServerError,
  ServiceQuotaError,
  AvailabilityError,
  ClientError,
} from "../../errors";
import { AnthropicCompletion } from "./types";

export type AnthropicError = {
  error: {
    type: string;
    message: string;
  };
};

export async function assessAnthropicResponse(
  response: Response
): Promise<boolean> {
  if (!response.ok) {
    const responseBody = await response.json();
    const status = response.status;
    const message =
      (responseBody as AnthropicError).error.message || response.statusText;
    switch (status) {
      case 401:
        throw new AuthorizationError(message);
      case 429: {
        // TODO: this quota dealio may not exist for Anthropic's generate...
        if (response.statusText.includes("quota"))
          throw new ServiceQuotaError(message);
        throw new RateLimitError(message);
      }
      case 500:
        throw new ServerError(message);
      case 529:
        throw new AvailabilityError(message);
      default:
        if (status >= 400 && status < 500) throw new ClientError(message);
        throw new Error(message);
    }
  }
  return true;
}
