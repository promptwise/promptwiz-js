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
var shared_exports = {};
__export(shared_exports, {
  _encoderNameForModel: () => _encoderNameForModel,
  _maxTokensForModel: () => _maxTokensForModel,
  _promptDollarCostForModel: () => _promptDollarCostForModel
});
module.exports = __toCommonJS(shared_exports);
function _promptDollarCostForModel(records, model, input_tokens, output_tokens) {
  const record = records[model];
  if (!record)
    throw new Error(`Invalid or unsupported model '${model}' for provider.`);
  const input_cents_per_token = record[2] / 1e3;
  const output_cents_per_token = record[3] / 1e3;
  input_tokens = Math.ceil(Math.max(0, input_tokens));
  output_tokens = Math.ceil(Math.max(0, output_tokens));
  return (input_cents_per_token * input_tokens + output_cents_per_token * output_tokens) / 100;
}
function _maxTokensForModel(records, model) {
  const record = records[model];
  if (!record)
    throw new Error(`Invalid or unsupported model '${model}' for provider.`);
  return record[1];
}
function _encoderNameForModel(records, model) {
  const record = records[model];
  if (!record)
    throw new Error(`Invalid or unsupported model '${model}' for provider.`);
  return record[0];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  _encoderNameForModel,
  _maxTokensForModel,
  _promptDollarCostForModel
});
