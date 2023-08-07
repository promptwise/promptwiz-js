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
var convertTextToChatMessages_exports = {};
__export(convertTextToChatMessages_exports, {
  convertTextToChatMessages: () => convertTextToChatMessages
});
module.exports = __toCommonJS(convertTextToChatMessages_exports);
const chatRegex = /(system|user|human|assistant):\s*([\s\S]*?)\s*(?=(?:system|user|human|assistant):|$)/gi;
function convertTextToChatMessages(text) {
  const messages = Array.from(text.matchAll(chatRegex)).map(
    ([_, role, content = ""]) => {
      role = role.toLowerCase();
      return {
        role: role === "human" ? "user" : role,
        content
      };
    }
  );
  if (!messages.length && text)
    messages.push({ role: "system", content: text });
  return messages;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertTextToChatMessages
});
