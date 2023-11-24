import {
  AuthorizationError,
  ClientError,
  RateLimitError,
  ServerError,
  ServiceQuotaError,
} from "../../errors";
import { CohereCompletion } from "./types";

export type CohereError = {
  error: {
    type: string;
    message: string;
  };
};

export async function assessCohereResponse(
  response: Response
): Promise<boolean> {
  if (!response.ok) {
    const responseBody = await response.json();
    const status = response.status;
    const message =
      (responseBody as CohereError).error.message || response.statusText;
    switch (status) {
      case 401:
        throw new AuthorizationError(message);
      case 429: {
        // TODO: this quota dealio may not exist for Cohere's generate...
        if (response.statusText.includes("quota"))
          throw new ServiceQuotaError(message);
        throw new RateLimitError(message);
      }
      case 500:
        throw new ServerError(message);
      default:
        if (status >= 400 && status < 500) throw new ClientError(message);
        throw new Error(message);
    }
  }
  return true;
}
