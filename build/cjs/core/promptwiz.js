"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
var import_hydratePromptInputs = require("./utils/hydratePromptInputs");
var providers = __toESM(require("./providers"));
var errors = __toESM(require("./errors"));
function promptwiz(config) {
  let is_running = false;
  const promptwizInstance = {
    get is_running() {
      return is_running;
    },
    config(update) {
      if (update.prompt) {
        config.prompt = update.prompt;
      }
      if (update.controller) {
        config.controller = update.controller;
      }
      if (update.prompt) {
        config.prompt = update.prompt;
      }
      return promptwizInstance;
    },
    run(inputs) {
      return __async(this, null, function* () {
        is_running = true;
        const prompt = inputs ? (0, import_hydratePromptInputs.hydratePromptInputs)(config.prompt, inputs) : config.prompt;
        const provider = providers[config.provider.name];
        let retries = -1;
        let delay = 2e3;
        const { max_retries = 3, parser } = config.controller;
        const ac = new AbortController();
        let outputs = [];
        while (++retries <= max_retries) {
          try {
            if (ac.signal.aborted)
              throw new errors.AbortError();
            outputs = yield provider.runPrompt(
              config.provider,
              prompt,
              ac.signal
            );
            outputs = parser ? outputs.map((o) => __spreadProps(__spreadValues({}, o), { output: parser(o.output) })) : outputs;
          } catch (error) {
            if (error instanceof errors.AbortError || ac.signal.aborted) {
              is_running = false;
              throw new errors.AbortError();
            }
            if (retries === max_retries || error instanceof errors.AuthorizationError) {
              is_running = false;
              throw error;
            }
            if (error instanceof errors.RateLimitError) {
              delay *= 2 ** retries;
              yield new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        }
        is_running = false;
        return outputs;
      });
    }
  };
  return promptwizInstance;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  promptwiz
});
