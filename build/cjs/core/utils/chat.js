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
var chat_exports = {};
__export(chat_exports, {
  assistantMessage: () => assistantMessage,
  chatMessage: () => chatMessage,
  systemMessage: () => systemMessage,
  userMessage: () => userMessage
});
module.exports = __toCommonJS(chat_exports);
function chatMessage(role, content) {
  return {
    role,
    content
  };
}
const userMessage = (content) => chatMessage("user", content);
const systemMessage = (content) => chatMessage("system", content);
const assistantMessage = (content) => chatMessage("assistant", content);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assistantMessage,
  chatMessage,
  systemMessage,
  userMessage
});
