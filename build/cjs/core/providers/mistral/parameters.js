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
  parametersFromOpenAI: () => parametersFromOpenAI,
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
  if (provider === "openai")
    return parametersFromOpenAI(params);
  throw new Error(`Unsupported provider: '${provider}'`);
}
function parametersFromOpenAI(params) {
  const result = {};
  if (params.max_tokens != null)
    result.max_tokens = params.max_tokens;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature * 0.5, 1));
  if (params.top_p != null) {
    result.top_p = params.top_p;
    if (params.top_p === 1e-11)
      result.top_p = 0;
    if (params.top_p === 0.99999999999)
      result.top_p = 1;
  }
  if (params.stream != null)
    result.stream = params.stream;
  return result;
}
function parametersFromAnthropic(params) {
  const result = {};
  if (params.max_tokens_to_sample != null)
    result.max_tokens = params.max_tokens_to_sample;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature / 2, 2));
  if (params.top_p != null)
    result.top_p = params.top_p;
  if (params.stream != null)
    result.stream = params.stream;
  return result;
}
function parametersFromCohere(params) {
  const result = {};
  if (params.max_tokens != null)
    result.max_tokens = params.max_tokens;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature * 0.4, 2));
  if (params.p != null) {
    result.top_p = params.p;
    if (params.p === 1e-11)
      result.top_p = 0;
    if (params.p === 0.99999999999)
      result.top_p = 1;
  }
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
  parametersFromOpenAI,
  parametersFromProvider
});
