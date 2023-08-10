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
var parameters_exports = {};
__export(parameters_exports, {
  maxGenerationsPerPrompt: () => maxGenerationsPerPrompt,
  maxTemperature: () => maxTemperature,
  minTemperature: () => minTemperature,
  parameters: () => parameters,
  parametersFromAnthropic: () => parametersFromAnthropic,
  parametersFromCohere: () => parametersFromCohere,
  parametersFromProvider: () => parametersFromProvider
});
module.exports = __toCommonJS(parameters_exports);
function parameters(params) {
  return params;
}
function maxGenerationsPerPrompt() {
  return 16;
}
function maxTemperature() {
  return 2;
}
function minTemperature() {
  return 0;
}
function parametersFromProvider(provider, params) {
  if (provider === "cohere")
    return parametersFromCohere(params);
  if (provider === "anthropic")
    return parametersFromAnthropic(params);
  throw new Error(`Unsupported provider: '${provider}'`);
}
function parametersFromAnthropic(params) {
  const result = { n: 1 };
  if (params.max_tokens_to_sample != null)
    result.max_tokens = params.max_tokens_to_sample;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature / 2, 2));
  if (params.top_k != null)
    result.top_k = params.top_k;
  if (params.top_p != null)
    result.top_p = params.top_p;
  if (Array.isArray(params.stop_sequences) && params.stop_sequences.length)
    result.stop = params.stop_sequences;
  if (params.stream != null)
    result.stream = params.stream;
  return result;
}
function parametersFromCohere(params) {
  const result = {};
  if (params.num_generations)
    result.n = params.num_generations;
  if (params.max_tokens != null)
    result.max_tokens = params.max_tokens;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature * 0.4, 2));
  if (params.k != null) {
    result.top_k = params.k;
  }
  if (params.p != null) {
    result.top_p = params.p;
    if (params.p === 1e-11)
      result.top_p = 0;
    if (params.p === 0.99999999999)
      result.top_p = 1;
  }
  if (params.frequency_penalty != null)
    result.frequency_penalty = Math.max(
      -2,
      Math.min(params.frequency_penalty * 4 - 2, 2)
    );
  if (params.presence_penalty != null)
    result.presence_penalty = Math.max(
      -2,
      Math.min(params.presence_penalty * 4 - 2, 2)
    );
  if (Array.isArray(params.stop_sequences) && params.stop_sequences.length)
    result.stop = params.stop_sequences;
  if (params.stream != null)
    result.stream = params.stream;
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  maxGenerationsPerPrompt,
  maxTemperature,
  minTemperature,
  parameters,
  parametersFromAnthropic,
  parametersFromCohere,
  parametersFromProvider
});
