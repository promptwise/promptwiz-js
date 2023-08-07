"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var generate_exports = {};
__export(generate_exports, {
  generate: () => generate
});
module.exports = __toCommonJS(generate_exports);
var import_utils = require("../../utils");
var import_errors = require("../../errors");
const generate = ({
  model,
  access_token,
  parameters,
  prompt,
  signal
}) => {
  if (!access_token)
    throw new import_errors.AuthorizationError(
      "Missing access_token required to use OpenAI generate!"
    );
  const isChatPrompt = Array.isArray(prompt);
  const isChatModel = model.includes("gpt-3.5") || model.includes("gpt-4");
  if (parameters == null ? void 0 : parameters.stream) {
    parameters.stream = false;
    console.warn(
      "Streaming responses not yet supported in promptwiz-js. Contributions welcome!"
    );
  }
  const requestBody = __spreadValues({
    model
  }, parameters);
  if (isChatModel) {
    requestBody.messages = isChatPrompt ? prompt : (0, import_utils.convertTextToChatMessages)(prompt);
  } else {
    requestBody.prompt = isChatPrompt ? `${(0, import_utils.convertChatMessagesToText)(prompt)}

Assistant:` : prompt;
  }
  const body = JSON.stringify(requestBody);
  return fetch(
    isChatModel ? "https://generate.openai.com/v1/chat/completions" : "https://generate.openai.com/v1/completions",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${access_token}`
      },
      signal,
      body
    }
  ).then((resp) => assessOpenAIResponse(resp));
};
function assessOpenAIResponse(response) {
  return __async(this, null, function* () {
    var _a, _b;
    const responseBody = yield response.json();
    if (!response.ok) {
      const status = response.status;
      const message = ((_a = responseBody.error) == null ? void 0 : _a.message) || ((_b = responseBody.error) == null ? void 0 : _b.response) || response.statusText;
      switch (status) {
        case 401:
          throw new import_errors.AuthorizationError(message);
        case 429: {
          if (message.includes("quota"))
            throw new import_errors.ServiceQuotaError(message);
          throw new import_errors.RateLimitError(message);
        }
        case 500:
          throw new import_errors.ServerError(message);
        default:
          throw new Error(message);
      }
    }
    return responseBody;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generate
});
