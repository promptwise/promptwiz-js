import {
  convertChatMessagesToText,
  convertTextToChatMessages,
} from "../../utils";
import {
  AuthorizationError,
  ClientError,
  RateLimitError,
  ServerError,
  ServiceQuotaError,
  AvailabilityError,
} from "../../errors";
import { ProviderGenerate } from "../../types";
import { OpenAICompletion, OpenAIParameters } from "./types";
import { OpenAIModel } from "./models";

export const generate: ProviderGenerate<
  OpenAIModel,
  OpenAIParameters,
  OpenAICompletion
> = ({ model, access_token, parameters, prompt, signal }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use OpenAI generate!"
    );

  const isChatPrompt = Array.isArray(prompt);
  const isChatModel = model.includes("gpt-3.5") || model.includes("gpt-4");

  const requestBody: Record<string, any> = {
    model,
    ...parameters,
    // stream,
  };

  if (requestBody?.stream) {
    requestBody.stream = false;
    console.warn(
      "Streaming responses not yet supported in promptwiz-js. Contributions welcome!"
    );
  }
  
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
  return fetch(
    isChatModel
      ? "https://generate.openai.com/v1/chat/completions"
      : "https://generate.openai.com/v1/completions",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${access_token}`,
      },
      signal,
      body,
    }
  ).then((resp) => assessOpenAIResponse(resp));
};

async function assessOpenAIResponse(response: Response) {
  const responseBody = await response.json();
  if (!response.ok) {
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
  return responseBody;
}
