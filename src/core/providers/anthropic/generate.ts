import { ProviderGenerate } from "../../types";
import { convertChatMessagesToText } from "../../utils";
import {
  AuthorizationError,
  RateLimitError,
  ServerError,
  ServiceQuotaError,
  AvailabilityError,
} from "../../errors";
import { AnthropicParameters, AnthropicCompletion } from "./types";
import { AnthropicModel } from "./models";

export const generate: ProviderGenerate<
  AnthropicModel,
  AnthropicParameters,
  AnthropicCompletion
> = ({ model, access_token, parameters, prompt, signal }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use Anthropic generate!"
    );

  if (parameters?.stream) {
    parameters.stream = false;
    console.warn(
      "Streaming responses not yet supported in promptwiz-js. Contributions welcome!"
    );
  }

  const isChatPrompt = Array.isArray(prompt);
  const requestBody: Record<string, any> = {
    model,
    ...parameters,
    // stream,
  };

  // All requests to Anthropic must follow their `\n\nHuman: prompt text\n\nAssistant:` format
  requestBody.prompt = `${(isChatPrompt
    ? convertChatMessagesToText(prompt)
    : prompt
  ).replaceAll("User:", "Human:")}\n\nAssistant:`;
  if (!requestBody.prompt.startsWith("\n\nHuman: ")) {
    requestBody.prompt = requestBody.prompt.startsWith("Human: ")
      ? `\n\n${requestBody.prompt}`
      : `\n\nHuman: ${requestBody.prompt}`;
  }

  const body = JSON.stringify(requestBody);
  return fetch("https://generate.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-generate-key": access_token,
    },
    signal,
    body,
  }).then((resp) => assessAnthropicResponse(resp));
};

type AnthropicError = {
  error: {
    type: string;
    message: string;
  };
};

async function assessAnthropicResponse(
  response: Response
): Promise<AnthropicCompletion> {
  const responseBody = await response.json();
  if (!response.ok) {
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
        throw new Error(message);
    }
  }
  return responseBody as AnthropicCompletion;
}
