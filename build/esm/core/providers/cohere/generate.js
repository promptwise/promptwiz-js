var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import {
  AuthorizationError,
  ClientError,
  RateLimitError,
  ServerError,
  ServiceQuotaError
} from "../../errors";
const generate = ({ model, access_token, parameters, prompt, signal }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use Cohere generate!"
    );
  const isChatPrompt = Array.isArray(prompt);
  const requestBody = __spreadValues({
    model
  }, parameters);
  if (requestBody == null ? void 0 : requestBody.stream) {
    requestBody.stream = false;
    console.warn(
      "Streaming responses not yet supported in promptwiz-js. Contributions welcome!"
    );
  }
  if (isChatPrompt) {
    let startIndex = 0;
    if (prompt[0].role === "system") {
      requestBody.preamble_override = prompt[0].content;
      startIndex = 1;
    }
    requestBody.chat_history = prompt.slice(startIndex, -1);
    requestBody.message = prompt.slice(-1)[0].content;
  } else {
    if (!(parameters == null ? void 0 : parameters.max_tokens))
      requestBody.max_tokens = 20;
    requestBody.prompt = prompt;
    requestBody.truncate = "NONE";
    requestBody.return_likelihoods = "NONE";
  }
  const body = JSON.stringify(requestBody);
  return fetch(
    isChatPrompt ? "https://api.cohere.com/v1/chat" : "https://api.cohere.com/v1/generate",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${access_token}`,
        "Cohere-Version": "2022-12-06"
      },
      signal,
      body
    }
  ).then((resp) => assessCohereResponse(resp));
};
async function assessCohereResponse(response) {
  const responseBody = await response.json();
  if (!response.ok) {
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
      default:
        if (status >= 400 && status < 500)
          throw new ClientError(message);
        throw new Error(message);
    }
  }
  return responseBody;
}
export {
  generate
};
