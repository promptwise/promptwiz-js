var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { template_regex } from "../../utils";
import { vocab_base64, merges_binary } from "./_encodings";
function base64decode(encodedString) {
  return atob(encodedString);
}
function decodeVocabulary(vocab_base642) {
  const byteArray = Uint8Array.from(
    base64decode(vocab_base642),
    (c) => c.charCodeAt(0)
  );
  const textDecoder = new TextDecoder("utf-8");
  return textDecoder.decode(byteArray).split("\n");
}
function utf8ByteToHex(c) {
  const hexValue = c.toString(16).toUpperCase().padStart(2, "0");
  return `<0x${hexValue}>`;
}
function hexToUtf8Byte(hex) {
  const strippedHex = hex.replace(/<0x|>/g, "");
  return parseInt(strippedHex, 16);
}
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8");
class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[0];
  }
  push(...values) {
    values.forEach((value) => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > 0) {
      this._swap(0, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[0] = value;
    this._siftDown();
    return replacedValue;
  }
  _parent(i) {
    return (i + 1 >>> 1) - 1;
  }
  _left(i) {
    return (i << 1) + 1;
  }
  _right(i) {
    return i + 1 << 1;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > 0 && this._greater(node, this._parent(node))) {
      this._swap(node, this._parent(node));
      node = this._parent(node);
    }
  }
  _siftDown() {
    let node = 0;
    while (this._left(node) < this.size() && this._greater(this._left(node), node) || this._right(node) < this.size() && this._greater(this._right(node), node)) {
      let maxChild = this._right(node) < this.size() && this._greater(this._right(node), this._left(node)) ? this._right(node) : this._left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}
class MistralTiktoken {
  constructor(options) {
    this.vocabByString = /* @__PURE__ */ new Map();
    this.merges = /* @__PURE__ */ new Map();
    this.chat_message_extra_tokens = (options == null ? void 0 : options.chat_message_extra_tokens) || 0;
    this.chat_messages_extra_tokens = (options == null ? void 0 : options.chat_messages_extra_tokens) || 0;
    this.vocabById = decodeVocabulary(vocab_base64);
    this.specialTokens = __spreadValues({}, options == null ? void 0 : options.extendedSpecialTokens);
    this.inverseSpecialTokens = Object.entries(this.specialTokens).reduce((memo, [text, rank]) => {
      memo[rank] = utf8Encoder.encode(text);
      return memo;
    }, {});
    this.vocabByString = /* @__PURE__ */ new Map();
    this.vocabById.forEach((tokenString, tokenId) => {
      this.vocabByString.set(tokenString, tokenId);
    });
    this.merges = this.decompressMerges(merges_binary);
  }
  getMergeIdentifierString(firstTokenId, secondTokenId) {
    return this.vocabById[firstTokenId] + " " + this.vocabById[secondTokenId];
  }
  decompressMerges(merges_binary2) {
    const byteArrayString = base64decode(merges_binary2);
    const byteArray = new Uint8Array(byteArrayString.length);
    for (let i = 0; i < byteArrayString.length; i++) {
      byteArray[i] = byteArrayString.charCodeAt(i);
    }
    const tokenIds = [];
    for (let i = 0; i < byteArray.length; i += 2) {
      const byte1 = byteArray[i];
      const byte2 = byteArray[i + 1];
      const tokenId = byte1 + (byte2 << 8);
      tokenIds.push(tokenId);
    }
    const merges = /* @__PURE__ */ new Map();
    for (let i = 0; i < tokenIds.length; i += 2) {
      const id1 = tokenIds[i];
      const id2 = tokenIds[i + 1];
      const mergeIdentifierString = this.getMergeIdentifierString(id1, id2);
      merges.set(mergeIdentifierString, i + 1);
    }
    return merges;
  }
  mapCharactersToTokenIds(prompt) {
    const tokenIds = [];
    const promptAltered = prompt.replaceAll(" ", this.vocabById[28705]);
    const charArray = Array.from(promptAltered);
    for (let i = 0; i < charArray.length; i++) {
      const c = charArray[i];
      if (this.vocabByString.has(c)) {
        tokenIds.push(this.vocabByString.get(c));
      } else {
        const bytes = utf8Encoder.encode(c);
        for (let j = 0; j < bytes.length; j++) {
          const hex = this.vocabByString.get(utf8ByteToHex(bytes[j]));
          tokenIds.push(hex);
          if (!(hex >= 0)) {
            console.log(
              "Encountered unknown character " + c + " (partial UTF-8 byte " + bytes[j] + " + hex + " + utf8ByteToHex(bytes[j]) + ")"
            );
            tokenIds[tokenIds.length - 1] = 0;
          }
        }
      }
    }
    return tokenIds;
  }
  encode(prompt, preserve_templates = false) {
    if (prompt.length === 0) {
      return [];
    }
    if (!preserve_templates) {
      prompt = prompt.replaceAll(template_regex, "");
    }
    const tokenIds = this.mapCharactersToTokenIds(prompt);
    const mergeQueue = new PriorityQueue((a, b) => {
      return a.mergePrio < b.mergePrio;
    });
    const addToMergeQueue = (leftNode) => {
      const mergeIdentifierString = this.getMergeIdentifierString(
        leftNode.tokenId,
        leftNode.next.tokenId
      );
      const mergePrio = (this.merges.get(mergeIdentifierString) || 0) + leftNode.origPos / prompt.length;
      if (mergePrio) {
        leftNode.mergePrio = mergePrio;
        leftNode.mergeToString = mergeIdentifierString.replace(" ", "");
        mergeQueue.push(leftNode);
      }
    };
    let firstTokenNode = {
      origPos: 0,
      tokenId: tokenIds[0],
      prev: null,
      next: null
    };
    let prevTokenNode = firstTokenNode;
    for (let i = 1; i < tokenIds.length; i++) {
      const currTokenNode = {
        origPos: i,
        tokenId: tokenIds[i],
        prev: prevTokenNode,
        next: null
      };
      prevTokenNode.next = currTokenNode;
      addToMergeQueue(prevTokenNode);
      prevTokenNode = currTokenNode;
    }
    while (!mergeQueue.isEmpty()) {
      const leftOfMerge = mergeQueue.pop();
      if (leftOfMerge.deleted)
        continue;
      if (!leftOfMerge.next)
        continue;
      if (leftOfMerge.next.deleted)
        continue;
      leftOfMerge.deleted = true;
      leftOfMerge.next.deleted = true;
      if (leftOfMerge.prev) {
        const oldPrev = leftOfMerge.prev;
        oldPrev.deleted = true;
        const newPrev = {
          origPos: oldPrev.origPos,
          tokenId: oldPrev.tokenId,
          prev: oldPrev.prev,
          next: oldPrev.next
        };
        leftOfMerge.prev = newPrev;
        if (newPrev.prev) {
          newPrev.prev.next = newPrev;
        } else {
          firstTokenNode = newPrev;
        }
      }
      const resultOfMerge = {
        origPos: leftOfMerge.origPos,
        tokenId: this.vocabByString.get(leftOfMerge.mergeToString),
        prev: leftOfMerge.prev,
        next: leftOfMerge.next.next
      };
      if (resultOfMerge.prev) {
        resultOfMerge.prev.next = resultOfMerge;
        resultOfMerge.prev;
        addToMergeQueue(resultOfMerge.prev);
      } else {
        firstTokenNode = resultOfMerge;
      }
      if (resultOfMerge.next) {
        resultOfMerge.next.prev = resultOfMerge;
        addToMergeQueue(resultOfMerge);
      }
    }
    const mergedTokenIds = [];
    for (let currTokenNode = firstTokenNode; currTokenNode !== null; currTokenNode = currTokenNode.next) {
      mergedTokenIds.push(currTokenNode.tokenId);
    }
    return mergedTokenIds;
  }
  decodeTokens(tokenIds) {
    var _a;
    const utf8byteVals = [];
    const startIndex = 0;
    for (let i = startIndex; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];
      let tokenString = (_a = this.vocabById[tokenId]) != null ? _a : this.inverseSpecialTokens[tokenId];
      if (tokenString.startsWith("<0x") && tokenString.endsWith(">")) {
        const utf8byte = hexToUtf8Byte(tokenString);
        utf8byteVals.push(utf8byte);
      } else {
        const utf8bytes = utf8Encoder.encode(tokenString);
        utf8bytes.forEach((utf8Byte) => utf8byteVals.push(utf8Byte));
      }
    }
    return utf8byteVals.map(
      (tok) => utf8Decoder.decode(new Uint8Array([tok])).replaceAll(this.vocabById[28705], " ")
    );
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
}
export {
  MistralTiktoken
};
