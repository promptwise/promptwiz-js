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
var parseTemplateStrings_exports = {};
__export(parseTemplateStrings_exports, {
  parseTemplateStrings: () => parseTemplateStrings,
  template_regex: () => template_regex
});
module.exports = __toCommonJS(parseTemplateStrings_exports);
const template_regex = /<(\w+)>/g;
function parseStrings(value) {
  const matches = [];
  let match;
  while ((match = template_regex.exec(value)) !== null)
    matches.push(match[1]);
  return matches;
}
function parseTemplateStrings(value) {
  const res = new Set(
    typeof value === "string" ? parseStrings(value) : value.reduce(
      (list, chat) => list.concat(parseStrings(chat.content)),
      []
    ).filter(Boolean)
  );
  return Array.from(res.values());
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseTemplateStrings,
  template_regex
});
