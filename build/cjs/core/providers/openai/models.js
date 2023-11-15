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
  "gpt-4-0314": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k-0314": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo-0301": ["openai_100k", 4096, 0.15, 0.2],
  "gpt-4-0613": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k-0613": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo-0613": ["openai_100k", 4096, 0.15, 0.2],
  "gpt-3.5-turbo-16k-0613": ["openai_100k", 16384, 0.3, 0.4],
  "gpt-4-1106-preview": ["openai_100k", 128e3, 1, 3],
  "gpt-4-vision-preview": ["openai_100k", 128e3, 1, 3],
  "gpt-3.5-turbo-1106": ["openai_100k", 16384, 0.1, 0.2],
  "text-embedding-ada-002": ["openai_100k", 2049, 0.2, 0.2],
  "gpt-4": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo": ["openai_100k", 4096, 0.1, 0.2],
  "gpt-3.5-turbo-16k": ["openai_100k", 16384, 0.1, 0.2],
  "gpt-3.5-turbo-instruct": ["openai_100k", 4096, 0.15, 0.2]
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
