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
  const isChatModel = (config.model.includes("gpt-3.5") || config.model.includes("gpt-4")) && !config.model.includes("instruct");
  const { choices, usage } = original;
  if (choices.length === 1) {
    return {
      outputs: [
        {
          content: isChatModel ? choices[0].message.content : choices[0].text,
          tokens: usage.completion_tokens,
          truncated: choices[0].finish_reason === "length"
        }
      ],
      original,
      usage: {
        input_tokens: usage.prompt_tokens,
        output_tokens: usage.completion_tokens,
        cost: (0, import_models.promptDollarCostForModel)(
          config.model,
          usage.prompt_tokens,
          usage.completion_tokens
        ),
        retries: 0
      }
    };
  }
  const _tokenizer = (0, import_tokenizer.tokenizer)(config.model);
  return {
    outputs: choices.map(
      isChatModel ? ({ message, finish_reason }) => ({
        content: message.content,
        tokens: _tokenizer.count(message.content),
        truncated: finish_reason === "length"
      }) : ({ text, finish_reason }) => ({
        content: text,
        tokens: _tokenizer.count(text),
        truncated: finish_reason === "length"
      })
    ),
    original,
    usage: {
      input_tokens: usage.prompt_tokens,
      output_tokens: usage.completion_tokens,
      cost: (0, import_models.promptDollarCostForModel)(
        config.model,
        usage.prompt_tokens,
        usage.completion_tokens
      ),
      retries: 0
    }
  };
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  prompt
});
