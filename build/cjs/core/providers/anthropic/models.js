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
  "claude-1": ["anthropic_64k", 1e5, 1.102, 3.268],
  "claude-instant-1.1": ["anthropic_64k", 1e5, 0.163, 0.551],
  "claude-instant-1.2": ["anthropic_64k", 1e5, 0.163, 0.551],
  "claude-2.0": ["anthropic_64k", 1e5, 1.102, 3.268],
  "claude-instant-1": ["anthropic_64k", 1e5, 0.163, 0.551],
  "claude-2": ["anthropic_64k", 1e5, 1.102, 3.268]
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
