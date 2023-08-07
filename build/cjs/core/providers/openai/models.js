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
var models_exports = {};
__export(models_exports, {
  encoderNameForModel: () => encoderNameForModel,
  maxTokensForModel: () => maxTokensForModel,
  models: () => models,
  promptDollarCostForModel: () => promptDollarCostForModel
});
module.exports = __toCommonJS(models_exports);
var import_shared = require("../shared");
const models = {
  "text-similarity-davinci-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-similarity-curie-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-similarity-babbage-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-similarity-ada-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-search-davinci-doc-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-search-curie-doc-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-search-babbage-doc-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-search-ada-doc-001": ["openai_50k", 2049, 0.2, 0.2],
  "code-search-babbage-code-001": ["openai_50k", 2049, 0.2, 0.2],
  "code-search-ada-code-001": ["openai_50k", 2049, 0.2, 0.2],
  davinci: ["openai_50k", 2049, 2, 2],
  curie: ["openai_50k", 2049, 0.2, 0.2],
  babbage: ["openai_50k", 2049, 0.05, 0.05],
  ada: ["openai_50k", 2049, 0.04, 0.04],
  "text-davinci-003": ["openai_50k", 4097, 2, 2],
  "text-davinci-002": ["openai_50k", 4097, 2, 2],
  "text-davinci-001": ["openai_50k", 2049, 2, 2],
  "text-curie-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-babbage-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-ada-001": ["openai_50k", 2049, 0.2, 0.2],
  "gpt-4-0314": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k-0314": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo-0301": ["openai_100k", 4096, 0.15, 0.2],
  "gpt-4-0613": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k-0613": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo-16k-0613": ["openai_100k", 16384, 0.3, 0.4],
  "text-embedding-ada-002": ["openai_100k", 2049, 0.2, 0.2],
  "gpt-4": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo": ["openai_100k", 4096, 0.15, 0.2],
  "gpt-3.5-turbo-16k": ["openai_100k", 16384, 0.3, 0.4],
  "gpt-3.5-turbo-instruct": ["openai_100k", 4096, 0, 0]
};
const promptDollarCostForModel = (model, input_tokens, output_tokens) => (0, import_shared._promptDollarCostForModel)(models, model, input_tokens, output_tokens);
const maxTokensForModel = (model) => (0, import_shared._maxTokensForModel)(models, model);
const encoderNameForModel = (model) => (0, import_shared._encoderNameForModel)(models, model);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  encoderNameForModel,
  maxTokensForModel,
  models,
  promptDollarCostForModel
});
