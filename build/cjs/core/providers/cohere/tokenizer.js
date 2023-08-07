"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var tokenizer_exports = {};
__export(tokenizer_exports, {
  tokenizer: () => tokenizer
});
module.exports = __toCommonJS(tokenizer_exports);
var import_tiktoken = require("../tiktoken");
var encodings = __toESM(require("./encodings"));
var import_models = require("./models");
const _encoder_cache = /* @__PURE__ */ new Map();
const tokenizer = (model, extendedSpecialTokens) => {
  const encoding = (0, import_models.encoderNameForModel)(model);
  const encoder = _encoder_cache.get(encoding) || new import_tiktoken.Tiktoken(encodings[encoding], {
    chat_message_extra_tokens: 5,
    chat_messages_extra_tokens: 5,
    extendedSpecialTokens
  });
  _encoder_cache.set(encoding, encoder);
  return encoder;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tokenizer
});
