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
var prompt_exports = {};
__export(prompt_exports, {
  prompt: () => prompt
});
module.exports = __toCommonJS(prompt_exports);
var import_models = require("./models");
var import_tokenizer = require("./tokenizer");
var import_generate = require("./generate");
const prompt = (config) => (0, import_generate.generate)(config).then((original) => {
  const _tokenizer = (0, import_tokenizer.tokenizer)(config.model);
  const input_tokens = _tokenizer.count(config.prompt);
  const output_tokens = _tokenizer.count(original.completion);
  return {
    outputs: [
      {
        content: original.completion,
        tokens: output_tokens,
        truncated: original.stop_reason === "max_tokens"
      }
    ],
    original,
    usage: {
      input_tokens,
      output_tokens,
      cost: (0, import_models.promptDollarCostForModel)(
        config.model,
        input_tokens,
        output_tokens
      ),
      retries: 0
    }
  };
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  prompt
});
