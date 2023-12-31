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
import { convertChatMessagesToText } from "../../utils";
import {
  AuthorizationError
} from "../../errors";
import { assessAnthropicResponse } from "./response";
const generate = ({ model, access_token, parameters, prompt, signal }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use Anthropic generate!"
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
  requestBody.prompt = `${(isChatPrompt ? convertChatMessagesToText(prompt) : prompt).replaceAll("User:", "Human:")}

Assistant:`;
  if (!requestBody.prompt.startsWith("\n\nHuman: ")) {
    requestBody.prompt = requestBody.prompt.startsWith("Human: ") ? `

${requestBody.prompt}` : `

Human: ${requestBody.prompt}`;
  }
  const body = JSON.stringify(requestBody);
  return fetch("https://api.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": access_token
    },
    signal,
    body
  }).then(
    (resp) => assessAnthropicResponse(resp).then((ok) => ok && resp.json())
  );
};
export {
  generate
};
