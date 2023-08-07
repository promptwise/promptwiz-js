"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
var tiktoken_exports = {};
__export(tiktoken_exports, {
  Tiktoken: () => Tiktoken
});
module.exports = __toCommonJS(tiktoken_exports);
var import_utils = require("../utils");
function bytePairMerge(piece, ranks) {
  let parts = Array.from(
    { length: piece.length },
    (_, i) => ({ start: i, end: i + 1 })
  );
  while (parts.length > 1) {
    let minRank = null;
    for (let i = 0; i < parts.length - 1; i++) {
      const slice = piece.slice(parts[i].start, parts[i + 1].end);
      const rank = ranks.get(slice.join(","));
      if (rank == null)
        continue;
      if (minRank == null || rank < minRank[0]) {
        minRank = [rank, i];
      }
    }
    if (minRank != null) {
      const i = minRank[1];
      parts[i] = { start: parts[i].start, end: parts[i + 1].end };
      parts.splice(i + 1, 1);
    } else {
      break;
    }
  }
  return parts;
}
function bytePairEncode(piece, ranks) {
  if (piece.length === 1)
    return [ranks.get(piece.join(","))];
  return bytePairMerge(piece, ranks).map((p) => ranks.get(piece.slice(p.start, p.end).join(","))).filter((x) => x != null);
}
function escapeRegex(str) {
  return str.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
}
const _Tiktoken = class {
  constructor(ranks, options) {
    this.textEncoder = new TextEncoder();
    this.textDecoder = new TextDecoder("utf-8");
    this.rankMap = /* @__PURE__ */ new Map();
    this.textMap = /* @__PURE__ */ new Map();
    this.patStr = ranks.pat_str;
    this.chat_message_extra_tokens = (options == null ? void 0 : options.chat_message_extra_tokens) || 0;
    this.chat_messages_extra_tokens = (options == null ? void 0 : options.chat_messages_extra_tokens) || 0;
    const uncompressed = ranks.bpe_ranks.split("\n").filter(Boolean).reduce((memo, x) => {
      const [_, offsetStr, ...tokens] = x.split(" ");
      const offset = Number.parseInt(offsetStr, 10);
      tokens.forEach((token, i) => memo[token] = offset + i);
      return memo;
    }, {});
    for (const [token, rank] of Object.entries(uncompressed)) {
      const bytes = Uint8Array.from(
        atob(token),
        (m) => m.codePointAt(0)
      );
      this.rankMap.set(bytes.join(","), rank);
      this.textMap.set(rank, bytes);
    }
    this.specialTokens = __spreadValues(__spreadValues({}, ranks.special_tokens), options == null ? void 0 : options.extendedSpecialTokens);
    this.inverseSpecialTokens = Object.entries(this.specialTokens).reduce((memo, [text, rank]) => {
      memo[rank] = this.textEncoder.encode(text);
      return memo;
    }, {});
  }
  encode(text, preserve_templates = false, allowedSpecial = [], disallowedSpecial = "all") {
    var _a;
    if (!preserve_templates) {
      text = text.replaceAll(import_utils.template_regex, "");
    }
    const regexes = new RegExp(this.patStr, "ug");
    const specialRegex = _Tiktoken.specialTokenRegex(
      Object.keys(this.specialTokens)
    );
    const ret = [];
    const allowedSpecialSet = new Set(
      allowedSpecial === "all" ? Object.keys(this.specialTokens) : allowedSpecial
    );
    const disallowedSpecialSet = new Set(
      disallowedSpecial === "all" ? Object.keys(this.specialTokens).filter(
        (x) => !allowedSpecialSet.has(x)
      ) : disallowedSpecial
    );
    if (disallowedSpecialSet.size > 0) {
      const disallowedSpecialRegex = _Tiktoken.specialTokenRegex([
        ...disallowedSpecialSet
      ]);
      const specialMatch = text.match(disallowedSpecialRegex);
      if (specialMatch != null) {
        throw new Error(
          `The text contains a special token that is not allowed: ${specialMatch[0]}`
        );
      }
    }
    let start = 0;
    while (true) {
      let nextSpecial = null;
      let startFind = start;
      while (true) {
        specialRegex.lastIndex = startFind;
        nextSpecial = specialRegex.exec(text);
        if (nextSpecial == null || allowedSpecialSet.has(nextSpecial[0]))
          break;
        startFind = nextSpecial.index + 1;
      }
      const end = (_a = nextSpecial == null ? void 0 : nextSpecial.index) != null ? _a : text.length;
      for (const match of text.substring(start, end).matchAll(regexes)) {
        const piece = this.textEncoder.encode(match[0]);
        const token2 = this.rankMap.get(piece.join(","));
        if (token2 != null) {
          ret.push(token2);
          continue;
        }
        ret.push(...bytePairEncode(piece, this.rankMap));
      }
      if (nextSpecial == null)
        break;
      let token = this.specialTokens[nextSpecial[0]];
      ret.push(token);
      start = nextSpecial.index + nextSpecial[0].length;
    }
    return ret;
  }
  decodeTokens(tokens) {
    var _a;
    const res = [];
    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i];
      const bytes = (_a = this.textMap.get(token)) != null ? _a : this.inverseSpecialTokens[token];
      if (bytes != null) {
        res.push(bytes);
      }
    }
    return res.map((bytes) => this.textDecoder.decode(bytes));
  }
  decode(tokens) {
    return this.decodeTokens(tokens).join("");
  }
  decodeToken(token) {
    return this.decodeTokens([token])[0];
  }
  count(value, preserve_templates = false) {
    if (typeof value === "string")
      return this.encode(value).length;
    if (!Array.isArray(value))
      return this.encode(value.content, preserve_templates).length + this.chat_message_extra_tokens;
    return value.reduce(
      (sum, msg) => sum + this.encode(msg.content, preserve_templates).length + this.chat_message_extra_tokens,
      this.chat_messages_extra_tokens
    );
  }
};
let Tiktoken = _Tiktoken;
Tiktoken.specialTokenRegex = (tokens) => {
  return new RegExp(tokens.map((i) => escapeRegex(i)).join("|"), "g");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Tiktoken
});
