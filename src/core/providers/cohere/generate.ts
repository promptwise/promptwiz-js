import { ProviderGenerate } from "../../types";
import { convertChatMessagesToText } from "../../utils";
import {
  AuthorizationError,
  ClientError,
  RateLimitError,
  ServerError,
  ServiceQuotaError,
} from "../../errors";
import { CohereParameters, CohereCompletion } from "./types";
import { CohereModel } from "./models";

export const generate: ProviderGenerate<
  CohereModel,
  CohereParameters,
  CohereCompletion
> = ({ model, access_token, parameters, prompt, signal }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use Cohere generate!"
    );

  const isChatPrompt = Array.isArray(prompt);
  const requestBody: Record<string, any> = {
    model,
    max_tokens: 20, // default set by Cohere (setting here to ensure it's existence later when calculating if output(s) were truncated)
    ...parameters,
    truncate: "NONE",
    return_likelihoods: "NONE",
  };

  if (requestBody?.stream) {
    requestBody.stream = false;
    console.warn(
      "Streaming responses not yet supported in promptwiz-js. Contributions welcome!"
    );
  }

  requestBody.prompt = isChatPrompt
    ? `${convertChatMessagesToText(prompt)}\n\nAssistant:`
    : prompt;

  const body = JSON.stringify(requestBody);
  return fetch("https://api.cohere.com/v1/generate", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${access_token}`,
      "Cohere-Version": "2022-12-06",
    },
    signal,
    body,
  }).then((resp) => assessCohereResponse(resp));
};

type CohereError = {
  error: {
    type: string;
    message: string;
  };
};

async function assessCohereResponse(
  response: Response
): Promise<CohereCompletion> {
  const responseBody = await response.json();
  if (!response.ok) {
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
  return responseBody as CohereCompletion;
}
