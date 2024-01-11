import {
  convertChatMessagesToText,
  convertTextToChatMessages,
} from "../../utils";
import { AuthorizationError } from "../../errors";
import { ProviderGenerate } from "../../types";
import { MistralCompletion, MistralParameters } from "./types";
import { MistralModel } from "./models";
import { fetchStream } from "./stream";
import { assessMistralResponse } from "./response";

export const generate: ProviderGenerate<
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
    stream: !!stream,
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
  // @ts-expect-error - later
  if (stream) return fetchStream(stream, isChatModel)(url, options);
  return fetch(url, options).then((resp) =>
    assessMistralResponse(resp).then((ok) => ok && resp.json())
  );
};
