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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var anthropic_exports = {};
__export(anthropic_exports, {
  anthropic: () => anthropic
});
module.exports = __toCommonJS(anthropic_exports);
var import_models = require("./models");
var import_tokenizer = require("./tokenizer");
var import_generate = require("./generate");
var import_prompt = require("./prompt");
var import_run = require("./run");
var import_api = require("./api");
var import_parameters = require("./parameters");
__reExport(anthropic_exports, require("./response"), module.exports);
const anthropic = {
  api: import_api.api,
  generate: import_generate.generate,
  prompt: import_prompt.prompt,
  run: import_run.run,
  tokenizer: import_tokenizer.tokenizer,
  promptDollarCostForModel: import_models.promptDollarCostForModel,
  maxTokensForModel: import_models.maxTokensForModel,
  parametersFromProvider: import_parameters.parametersFromProvider,
  maxGenerationsPerPrompt: import_parameters.maxGenerationsPerPrompt,
  maxTemperature: import_parameters.maxTemperature,
  minTemperature: import_parameters.minTemperature,
  parameters: import_parameters.parameters
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  anthropic
});
