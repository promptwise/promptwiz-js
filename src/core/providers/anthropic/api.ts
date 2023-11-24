import { ProviderApi } from "../../types";
import { convertChatMessagesToText } from "../../utils";
import { AuthorizationError } from "../../errors";
import { AnthropicParameters, AnthropicCompletion } from "./types";
import { AnthropicModel } from "./models";

export const api: ProviderApi<
  AnthropicModel,
  AnthropicParameters,
  AnthropicCompletion
> = ({ model, access_token, parameters, prompt, signal, stream }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use Anthropic generate!"
    );

  const isChatPrompt = Array.isArray(prompt);
  const requestBody: Record<string, any> = {
    model,
    ...parameters,
    stream,
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
  return fetch("https://api.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": access_token,
    },
    signal,
    body,
  });
};
