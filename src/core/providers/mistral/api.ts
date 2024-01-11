import {
  convertChatMessagesToText,
  convertTextToChatMessages,
} from "../../utils";
import { AuthorizationError } from "../../errors";
import { ProviderApi } from "../../types";
import { MistralCompletion, MistralParameters } from "./types";
import { MistralModel } from "./models";

export const api: ProviderApi<
  MistralModel,
  MistralParameters,
  MistralCompletion
> = ({ model, access_token, parameters, prompt, signal, stream }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use Mistral generate!"
    );

  const isChatPrompt = Array.isArray(prompt);

  const requestBody: Record<string, any> = {
    model,
    ...parameters,
    stream,
    messages: isChatPrompt
      ? prompt
      : convertTextToChatMessages(prompt)
  };
 
  const body = JSON.stringify(requestBody);
  const url = "https://api.mistral.ai/v1/chat/completions";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${access_token}`,
    },
    signal,
    body,
  };
  return fetch(url, options);
};
