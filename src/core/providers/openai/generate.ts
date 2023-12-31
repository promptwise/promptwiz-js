import {
  convertChatMessagesToText,
  convertTextToChatMessages,
} from "../../utils";
import { AuthorizationError } from "../../errors";
import { ProviderGenerate } from "../../types";
import { OpenAICompletion, OpenAIParameters } from "./types";
import { OpenAIModel } from "./models";
import { fetchStream } from "./stream";
import { assessOpenAIResponse } from "./response";

export const generate: ProviderGenerate<
  OpenAIModel,
  OpenAIParameters,
  OpenAICompletion
> = ({ model, access_token, parameters, prompt, signal, stream }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use OpenAI generate!"
    );

  const isChatPrompt = Array.isArray(prompt);
  const isChatModel = model.includes("gpt-3.5") || model.includes("gpt-4");

  const requestBody: Record<string, any> = {
    model,
    ...parameters,
    stream: !!stream,
  };

  if (isChatModel) {
    requestBody.messages = isChatPrompt
      ? prompt
      : convertTextToChatMessages(prompt);
  } else {
    requestBody.prompt = isChatPrompt
      ? `${convertChatMessagesToText(prompt)}\n\nAssistant:`
      : prompt;
  }
  const body = JSON.stringify(requestBody);
  const url = isChatModel
    ? "https://api.openai.com/v1/chat/completions"
    : "https://api.openai.com/v1/completions";
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
    assessOpenAIResponse(resp).then((ok) => ok && resp.json())
  );
};
