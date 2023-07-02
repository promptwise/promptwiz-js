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
var hydratePromptInputs_exports = {};
__export(hydratePromptInputs_exports, {
  hydratePromptInputs: () => hydratePromptInputs
});
module.exports = __toCommonJS(hydratePromptInputs_exports);
var import_parseTemplateStrings = require("./parseTemplateStrings");
function hydratePromptInputs(prompt, inputs) {
  const templates = (0, import_parseTemplateStrings.parseTemplateStrings)(prompt);
  if (!templates.length)
    return prompt;
  if (typeof prompt === "string") {
    for (const key of templates) {
      prompt = prompt.replaceAll(`<${key}>`, inputs[key]);
    }
  } else {
    prompt = JSON.parse(JSON.stringify(prompt));
    for (const key of templates) {
      if (key === "chat_inputs") {
        prompt = prompt.concat(JSON.parse(inputs[key]));
      } else {
        for (const msg of prompt) {
          msg.content = msg.content.replaceAll(`<${key}>`, inputs[key]);
        }
      }
    }
  }
  return prompt;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  hydratePromptInputs
});
