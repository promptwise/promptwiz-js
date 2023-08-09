"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var fallbacks_exports = {};
__export(fallbacks_exports, {
  cheapest: () => cheapest,
  fastest: () => fastest,
  largest: () => largest,
  strongest: () => strongest
});
module.exports = __toCommonJS(fallbacks_exports);
const fastest = {
  after_errors: 1,
  models: [
    { provider: "cohere", model: "command-light" },
    { provider: "cohere", model: "command-light-nightly" },
    { provider: "cohere", model: "command" },
    { provider: "cohere", model: "command-nightly" },
    { provider: "anthropic", model: "claude-instant-1" },
    { provider: "anthropic", model: "claude-instant-1.1" },
    { provider: "openai", model: "text-davinci-002" },
    { provider: "openai", model: "text-davinci-003" },
    { provider: "openai", model: "gpt-3.5-turbo" },
    { provider: "openai", model: "gpt-3.5-turbo-0301" },
    { provider: "openai", model: "gpt-3.5-turbo-16k" },
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" },
    { provider: "openai", model: "gpt-4" },
    { provider: "openai", model: "gpt-4-0613" },
    { provider: "openai", model: "gpt-4-0314" },
    { provider: "openai", model: "gpt-4-32k" },
    { provider: "openai", model: "gpt-4-32k-0613" },
    { provider: "openai", model: "gpt-4-32k-0314" },
    { provider: "anthropic", model: "claude-1" },
    { provider: "anthropic", model: "claude-2" },
    { provider: "anthropic", model: "claude-2.0" }
  ]
};
const cheapest = {
  after_errors: 2,
  models: [
    { provider: "openai", model: "gpt-3.5-turbo-instruct" },
    { provider: "anthropic", model: "claude-instant-1" },
    { provider: "anthropic", model: "claude-instant-1.1" },
    { provider: "openai", model: "gpt-3.5-turbo-0301" },
    { provider: "openai", model: "gpt-3.5-turbo" },
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" },
    { provider: "anthropic", model: "claude-1" },
    { provider: "anthropic", model: "claude-2.0" },
    { provider: "anthropic", model: "claude-2" },
    { provider: "cohere", model: "command" },
    { provider: "cohere", model: "command-light" },
    { provider: "cohere", model: "command-nightly" },
    { provider: "cohere", model: "command-light-nightly" },
    { provider: "openai", model: "text-davinci-002" },
    { provider: "openai", model: "text-davinci-003" },
    { provider: "openai", model: "gpt-4-0613" },
    { provider: "openai", model: "gpt-4" },
    { provider: "openai", model: "gpt-4-0314" },
    { provider: "openai", model: "gpt-4-32k-0613" },
    { provider: "openai", model: "gpt-4-32k-0314" },
    { provider: "openai", model: "gpt-4-32k" }
  ]
};
const strongest = {
  after_errors: 3,
  models: [
    { provider: "openai", model: "gpt-4-32k" },
    { provider: "openai", model: "gpt-4-32k-0314" },
    { provider: "openai", model: "gpt-4-32k-0613" },
    { provider: "openai", model: "gpt-4" },
    { provider: "openai", model: "gpt-4-0613" },
    { provider: "openai", model: "gpt-4-0314" },
    { provider: "openai", model: "gpt-3.5-turbo" },
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" },
    { provider: "openai", model: "gpt-3.5-turbo-0301" },
    { provider: "openai", model: "text-davinci-003" },
    { provider: "openai", model: "text-davinci-002" },
    { provider: "anthropic", model: "claude-2" },
    { provider: "anthropic", model: "claude-2.0" },
    { provider: "anthropic", model: "claude-1" },
    { provider: "anthropic", model: "claude-instant-1" },
    { provider: "anthropic", model: "claude-instant-1.1" },
    { provider: "cohere", model: "command-nightly" },
    { provider: "cohere", model: "command" },
    { provider: "cohere", model: "command-light-nightly" },
    { provider: "cohere", model: "command-light" }
  ]
};
const largest = {
  after_errors: 3,
  models: [
    { provider: "cohere", model: "command-light" },
    { provider: "cohere", model: "command-light-nightly" },
    { provider: "cohere", model: "command" },
    { provider: "cohere", model: "command-nightly" },
    { provider: "anthropic", model: "claude-instant-1.1" },
    { provider: "anthropic", model: "claude-instant-1" },
    { provider: "anthropic", model: "claude-1" },
    { provider: "anthropic", model: "claude-2.0" },
    { provider: "anthropic", model: "claude-2" },
    { provider: "openai", model: "text-davinci-002" },
    { provider: "openai", model: "text-davinci-003" },
    { provider: "openai", model: "gpt-3.5-turbo-0301" },
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" },
    { provider: "openai", model: "gpt-3.5-turbo" },
    { provider: "openai", model: "gpt-4-0314" },
    { provider: "openai", model: "gpt-4-0613" },
    { provider: "openai", model: "gpt-4" },
    { provider: "openai", model: "gpt-4-32k-0613" },
    { provider: "openai", model: "gpt-4-32k-0314" },
    { provider: "openai", model: "gpt-4-32k" }
  ]
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cheapest,
  fastest,
  largest,
  strongest
});
