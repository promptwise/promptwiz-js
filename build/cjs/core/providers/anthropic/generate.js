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
const generate = ({ model, access_token, parameters, prompt, signal }) => {
  if (!access_token)
    throw new import_errors.AuthorizationError(
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
  requestBody.prompt = `${(isChatPrompt ? (0, import_utils.convertChatMessagesToText)(prompt) : prompt).replaceAll("User:", "Human:")}

Assistant:`;
  if (!requestBody.prompt.startsWith("\n\nHuman: ")) {
    requestBody.prompt = requestBody.prompt.startsWith("Human: ") ? `

${requestBody.prompt}` : `

Human: ${requestBody.prompt}`;
  }
  const body = JSON.stringify(requestBody);
  return fetch("https://generate.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-generate-key": access_token
    },
    signal,
    body
  }).then((resp) => assessAnthropicResponse(resp));
};
function assessAnthropicResponse(response) {
  return __async(this, null, function* () {
    const responseBody = yield response.json();
    if (!response.ok) {
      const status = response.status;
      const message = responseBody.error.message || response.statusText;
      switch (status) {
        case 401:
          throw new import_errors.AuthorizationError(message);
        case 429: {
          if (response.statusText.includes("quota"))
            throw new import_errors.ServiceQuotaError(message);
          throw new import_errors.RateLimitError(message);
        }
        case 500:
          throw new import_errors.ServerError(message);
        case 529:
          throw new import_errors.AvailabilityError(message);
        default:
          if (status >= 400 && status < 500)
            throw new import_errors.ClientError(message);
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
