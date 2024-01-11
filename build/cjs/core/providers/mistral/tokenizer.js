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
var tokenizer_exports = {};
__export(tokenizer_exports, {
  tokenizer: () => tokenizer
});
module.exports = __toCommonJS(tokenizer_exports);
var import_tokenizer = require("./_tokenizer");
let _encoder_cache = null;
const tokenizer = (model, extendedSpecialTokens) => {
  let encoder = _encoder_cache || new import_tokenizer.MistralTiktoken({
    chat_message_extra_tokens: 7,
    chat_messages_extra_tokens: 0,
    extendedSpecialTokens
  });
  _encoder_cache = encoder;
  return encoder;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tokenizer
});
