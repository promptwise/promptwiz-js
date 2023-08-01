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
  encodingForModel,
  getEncodingNameForModel
} from "js-tiktoken";
import { template_regex } from "../utils/parseTemplateStrings";
import { convertChatMessagesToText, convertTextToChatMessages } from "../utils";
import {
  AuthorizationError,
  RateLimitError,
  ServerError,
  ServiceQuotaError
} from "../errors";
const runPrompt = ({ model, access_token, parameters }, prompt, signal) => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use OpenAI api!"
    );
  const isChatPrompt = Array.isArray(prompt);
  const isChatModel = model.includes("gpt-3.5") || model.includes("gpt-4");
  const requestBody = __spreadValues({
    model
  }, parameters);
  if (isChatModel) {
    requestBody.messages = isChatPrompt ? prompt : convertTextToChatMessages(prompt);
  } else {
    requestBody.prompt = isChatPrompt ? convertChatMessagesToText(prompt) : prompt;
  }
  const body = JSON.stringify(requestBody);
  return fetch(
    isChatModel ? "https://api.openai.com/v1/chat/completions" : "https://api.openai.com/v1/completions",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${access_token}`
      },
      signal,
      body
    }
  ).then((resp) => assessOpenAIResponse(resp)).then((original) => {
    const { choices, usage } = original;
    if (!choices.length)
      return { outputs: [], original };
    if (choices.length === 1) {
      return {
        outputs: [
          {
            content: choices[0].message.content,
            tokens: usage.completion_tokens,
            truncated: choices[0].finish_reason === "length"
          }
        ],
        original
      };
    }
    const tokenizer = getTokenizer(model);
    return {
      outputs: choices.map(
        isChatModel ? ({ message, finish_reason }) => ({
          content: message.content,
          tokens: tokenizer.count(message.content),
          truncated: finish_reason === "length"
        }) : ({ text, finish_reason }) => ({
          content: text,
          tokens: tokenizer.count(text),
          truncated: finish_reason === "length"
        })
      ),
      original
    };
  });
};
async function assessOpenAIResponse(response) {
  var _a, _b;
  const responseBody = await response.json();
  if (!response.ok) {
    const status = response.status;
    const message = ((_a = responseBody.error) == null ? void 0 : _a.message) || ((_b = responseBody.error) == null ? void 0 : _b.response) || "Unknown API response";
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
        throw new Error(message);
    }
  }
  return responseBody;
}
let _encoder_cache = null;
function getTokenizer(model, specialTokens) {
  const encoding = getEncodingNameForModel(model);
  const encoder = (_encoder_cache == null ? void 0 : _encoder_cache.encoding) === encoding && !specialTokens ? _encoder_cache.encoder : encodingForModel(model, specialTokens);
  _encoder_cache = {
    encoding,
    encoder,
    specialTokens
  };
  const decode_array = (tokens) => {
    var _a;
    const res = [];
    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i];
      const bytes = (_a = encoder.textMap.get(token)) != null ? _a : encoder.inverseSpecialTokens[token];
      if (bytes != null) {
        res.push(bytes);
      }
    }
    return res.map((bytes) => encoder.textDecoder.decode(bytes));
  };
  return {
    encode(text, preserve_templates = false) {
      const tokens = Array.from(
        encoder.encode(
          preserve_templates ? text : text.replaceAll(template_regex, "")
        )
      );
      return [...tokens];
    },
    decode: (tokens) => encoder.decode(tokens),
    decodeTokens(tokens) {
      return decode_array(tokens);
    },
    decodeToken(tokens) {
      return decode_array([tokens])[0];
    },
    count(value, preserve_templates = false) {
      if (typeof value === "string")
        return this.encode(value).length;
      if (!Array.isArray(value))
        return this.encode(value.content, preserve_templates).length + 5;
      return value.reduce(
        (sum, msg) => sum + this.encode(msg.content, preserve_templates).length + 5,
        3
      );
    }
  };
}
function maxTokensForModel(model) {
  const model_windows = {
    "text-similarity-davinci-001": 2049,
    "text-similarity-curie-001": 2049,
    "text-similarity-babbage-001": 2049,
    "text-similarity-ada-001": 2049,
    "text-search-davinci-doc-001": 2049,
    "text-search-curie-doc-001": 2049,
    "text-search-babbage-doc-001": 2049,
    "text-search-ada-doc-001": 2049,
    "code-search-babbage-code-001": 2049,
    "code-search-ada-code-001": 2049,
    davinci: 2049,
    curie: 2049,
    babbage: 2049,
    ada: 2049,
    "text-davinci-003": 4097,
    "text-davinci-002": 4097,
    "text-davinci-001": 2049,
    "text-curie-001": 2049,
    "text-babbage-001": 2049,
    "text-ada-001": 2049,
    "gpt-4-0314": 8192,
    "gpt-4-32k-0314": 32768,
    "gpt-3.5-turbo-0301": 4096,
    "gpt-4-0613": 8192,
    "gpt-4-32k-0613": 32768,
    "gpt-3.5-turbo-16k-0613": 16384,
    "text-embedding-ada-002": 2049,
    "gpt-4": 8192,
    "gpt-4-32k": 32768,
    "gpt-3.5-turbo": 4096,
    "gpt-3.5-turbo-16k": 16384,
    "gpt-3.5-turbo-instruct": 4096
  };
  return model_windows[model] || 0;
}
function pricePerPrompt(model, input_tokens, output_tokens) {
  const model_costs = {
    "text-similarity-davinci-001": [0.2, 0.2],
    "text-similarity-curie-001": [0.2, 0.2],
    "text-similarity-babbage-001": [0.2, 0.2],
    "text-similarity-ada-001": [0.2, 0.2],
    "text-search-davinci-doc-001": [0.2, 0.2],
    "text-search-curie-doc-001": [0.2, 0.2],
    "text-search-babbage-doc-001": [0.2, 0.2],
    "text-search-ada-doc-001": [0.2, 0.2],
    "code-search-babbage-code-001": [0.2, 0.2],
    "code-search-ada-code-001": [0.2, 0.2],
    davinci: [2, 2],
    curie: [0.2, 0.2],
    babbage: [0.05, 0.05],
    ada: [0.04, 0.04],
    "text-davinci-003": [2, 2],
    "text-davinci-002": [2, 2],
    "text-davinci-001": [2, 2],
    "text-curie-001": [0.2, 0.2],
    "text-babbage-001": [0.2, 0.2],
    "text-ada-001": [0.2, 0.2],
    "gpt-4-0314": [3, 6],
    "gpt-4-32k-0314": [6, 12],
    "gpt-3.5-turbo-0301": [0.15, 0.2],
    "gpt-4-0613": [3, 6],
    "gpt-4-32k-0613": [6, 12],
    "gpt-3.5-turbo-16k-0613": [0.3, 0.4],
    "text-embedding-ada-002": [0.2, 0.2],
    "gpt-4": [3, 6],
    "gpt-4-32k": [6, 12],
    "gpt-3.5-turbo": [0.15, 0.2],
    "gpt-3.5-turbo-16k": [0.3, 0.4],
    "gpt-3.5-turbo-instruct": [0, 0]
  };
  const cost = model_costs[model] || [0, 0];
  return (cost[0] * input_tokens + cost[1] * output_tokens) / 10;
}
export {
  getTokenizer,
  maxTokensForModel,
  pricePerPrompt,
  runPrompt
};
