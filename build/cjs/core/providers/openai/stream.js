"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var stream_exports = {};
__export(stream_exports, {
  fetchStream: () => fetchStream
});
module.exports = __toCommonJS(stream_exports);
var import_response = require("./response");
function fetchStream(streamHandler, isChat = true) {
  return (url, init) => __async(this, null, function* () {
    return new Promise((resolve, reject) => __async(this, null, function* () {
      const response = yield fetch(url, init);
      try {
        console.log({ response });
        (0, import_response.assessOpenAIResponse)(response);
      } catch (error) {
        reject(error);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let allResponses = [];
      let buffer_text = "";
      function processChunk() {
        return __async(this, null, function* () {
          try {
            const { done, value } = yield reader.read();
            if (done) {
              const combined = allResponses.reduce(
                ({ choices }, chunk) => {
                  chunk.choices.forEach(
                    isChat ? (_a) => {
                      var _b = _a, { delta, index } = _b, other = __objRest(_b, ["delta", "index"]);
                      var _a2, _b2;
                      const prev = (_a2 = choices[index]) == null ? void 0 : _a2.message;
                      choices[index] = __spreadProps(__spreadValues(__spreadValues({}, choices[index]), other), {
                        message: {
                          role: (prev == null ? void 0 : prev.role) || delta.role || "assistant",
                          content: `${prev == null ? void 0 : prev.content}${((_b2 = delta == null ? void 0 : delta.message) == null ? void 0 : _b2.content) || ""}`
                        }
                      });
                    } : (_c) => {
                      var _d = _c, { text, index } = _d, other = __objRest(_d, ["text", "index"]);
                      var _a;
                      choices[index] = __spreadProps(__spreadValues(__spreadValues({}, choices[index]), other), {
                        text: `${(_a = choices[index]) == null ? void 0 : _a.text}${text || ""}`
                      });
                    }
                  );
                  return __spreadProps(__spreadValues({}, chunk), {
                    choices
                  });
                },
                { choices: [] }
              );
              return resolve(combined);
            }
            const txt = decoder.decode(value);
            buffer_text = `${buffer_text}${txt.startsWith("data: ") ? "\n\n" : ""}${txt}`;
            const chunks = buffer_text.split("\n\n");
            buffer_text = chunks.pop() || "";
            let obj;
            for (const chunk of chunks) {
              if (!chunk.trim() || chunk.includes("data: [DONE]"))
                continue;
              obj = JSON.parse(chunk.trim().slice(6));
              allResponses.push(obj);
              streamHandler(
                obj.choices.map((c) => ({
                  delta: isChat ? c.delta : c.text,
                  index: c.index
                })),
                false
              );
            }
            processChunk();
          } catch (error) {
            reject(error);
          }
        });
      }
      processChunk();
    }));
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchStream
});
