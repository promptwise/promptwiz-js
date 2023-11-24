import { ProviderApi } from "../../types";
import { AuthorizationError } from "../../errors";
import { CohereParameters, CohereCompletion } from "./types";
import { CohereModel } from "./models";

export const api: ProviderApi<
  CohereModel,
  CohereParameters,
  CohereCompletion
> = ({ model, access_token, parameters, prompt, signal, stream }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use Cohere generate!"
    );

  const isChatPrompt = Array.isArray(prompt);
  const requestBody: Record<string, any> = {
    model,
    ...parameters,
    stream,
  };
  if (isChatPrompt) {
    let startIndex = 0;
    if (prompt[0].role === "system") {
      requestBody.preamble_override = prompt[0].content;
      startIndex = 1;
    }
    requestBody.chat_history = prompt.slice(startIndex, -1);
    requestBody.message = prompt.slice(-1)[0].content;
  } else {
    if (!parameters?.max_tokens) requestBody.max_tokens = 20; // default set by Cohere (setting here to ensure it's existence later when calculating if output(s) were truncated)
    requestBody.prompt = prompt;
    requestBody.truncate = "NONE";
    requestBody.return_likelihoods = "NONE";
  }

  const body = JSON.stringify(requestBody);
  return fetch(
    isChatPrompt
      ? "https://api.cohere.com/v1/chat"
      : "https://api.cohere.com/v1/generate",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${access_token}`,
        "Cohere-Version": "2022-12-06",
      },
      signal,
      body,
    }
  );
};
