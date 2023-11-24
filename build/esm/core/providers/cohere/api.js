var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { AuthorizationError } from "../../errors";
const api = ({ model, access_token, parameters, prompt, signal, stream }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use Cohere generate!"
    );
  const isChatPrompt = Array.isArray(prompt);
  const requestBody = __spreadProps(__spreadValues({
    model
  }, parameters), {
    stream
  });
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
  );
};
export {
  api
};
