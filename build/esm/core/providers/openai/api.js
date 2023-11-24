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
import {
  convertChatMessagesToText,
  convertTextToChatMessages
} from "../../utils";
import { AuthorizationError } from "../../errors";
const api = ({ model, access_token, parameters, prompt, signal, stream }) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use OpenAI generate!"
    );
  const isChatPrompt = Array.isArray(prompt);
  const isChatModel = model.includes("gpt-3.5") || model.includes("gpt-4");
  const requestBody = __spreadProps(__spreadValues({
    model
  }, parameters), {
    stream
  });
  if (isChatModel) {
    requestBody.messages = isChatPrompt ? prompt : convertTextToChatMessages(prompt);
  } else {
    requestBody.prompt = isChatPrompt ? `${convertChatMessagesToText(prompt)}

Assistant:` : prompt;
  }
  const body = JSON.stringify(requestBody);
  const url = isChatModel ? "https://api.openai.com/v1/chat/completions" : "https://api.openai.com/v1/completions";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${access_token}`
    },
    signal,
    body
  };
  return fetch(url, options);
};
export {
  api
};
