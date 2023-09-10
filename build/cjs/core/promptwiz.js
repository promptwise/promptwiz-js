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
var promptwiz_exports = {};
__export(promptwiz_exports, {
  promptwiz: () => promptwiz
});
module.exports = __toCommonJS(promptwiz_exports);
var import_getProvider = require("./getProvider");
var import_runPrompt = require("./providers/runPrompt");
var import_utils = require("./utils");
function promptwiz(config) {
  config = __spreadValues({}, config);
  let is_running = false;
  let ac = null;
  const promptwizInstance = {
    get is_running() {
      return is_running;
    },
    config(update) {
      config = __spreadValues(__spreadValues({}, config), update);
      return promptwizInstance;
    },
    abort() {
      ac == null ? void 0 : ac.abort();
    },
    run(inputs) {
      return __async(this, null, function* () {
        if (is_running)
          throw new Error("Cannot run while another prompt is already running.");
        is_running = true;
        ac = new AbortController();
        return (0, import_runPrompt.runPrompt)(
          config,
          (_config) => (0, import_getProvider.getProvider)(_config.provider).prompt(__spreadProps(__spreadValues({}, _config), {
            prompt: inputs ? (0, import_utils.hydratePromptInputs)(_config.prompt, inputs) : _config.prompt
          }))
        ).then((res) => {
          is_running = false;
          return res;
        });
      });
    }
  };
  return promptwizInstance;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  promptwiz
});
