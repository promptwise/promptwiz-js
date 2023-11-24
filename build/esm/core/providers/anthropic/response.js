import {
  AuthorizationError,
  RateLimitError,
  ServerError,
  ServiceQuotaError,
  AvailabilityError,
  ClientError
} from "../../errors";
async function assessAnthropicResponse(response) {
  if (!response.ok) {
    const responseBody = await response.json();
    const status = response.status;
    const message = responseBody.error.message || response.statusText;
    switch (status) {
      case 401:
        throw new AuthorizationError(message);
      case 429: {
        if (response.statusText.includes("quota"))
          throw new ServiceQuotaError(message);
        throw new RateLimitError(message);
      }
      case 500:
        throw new ServerError(message);
      case 529:
        throw new AvailabilityError(message);
      default:
        if (status >= 400 && status < 500)
          throw new ClientError(message);
        throw new Error(message);
    }
  }
  return true;
}
export {
  assessAnthropicResponse
};
