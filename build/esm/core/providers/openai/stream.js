var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
import { assessOpenAIResponse } from "./response";
function fetchStream(streamHandler, isChat = true) {
  return async (url, init) => new Promise(async (resolve, reject) => {
    const response = await fetch(url, init);
    try {
      assessOpenAIResponse(response);
    } catch (error) {
      reject(error);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let allResponses = [];
    let buffer_text = "";
    async function processChunk() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          streamHandler([], true);
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
    }
    processChunk();
  });
}
export {
  fetchStream
};
