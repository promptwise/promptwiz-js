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
var runPrompt_exports = {};
__export(runPrompt_exports, {
  runPrompt: () => runPrompt
});
module.exports = __toCommonJS(runPrompt_exports);
var errors = __toESM(require("../errors"));
var import_getProvider = require("../getProvider");
function runPrompt(_a, promptRunner) {
  return __async(this, null, function* () {
    var _b = _a, {
      max_retries = 3,
      retry_if_parser_fails = true,
      parser,
      signal,
      fallbacks
    } = _b, config = __objRest(_b, [
      "max_retries",
      "retry_if_parser_fails",
      "parser",
      "signal",
      "fallbacks"
    ]);
    let retries = -1;
    let delay = 0;
    let cumulative_input_tokens = 0;
    let cumulative_output_tokens = 0;
    let cumulative_cost = 0;
    let run_error;
    let current = {
      provider: config.provider,
      model: config.model,
      parameters: config.parameters
    };
    while (++retries <= max_retries) {
      try {
        if (signal == null ? void 0 : signal.aborted)
          throw new errors.AbortError();
        const { outputs, original, usage } = yield promptRunner(__spreadValues(__spreadValues({}, config), current));
        cumulative_input_tokens += usage.input_tokens;
        cumulative_output_tokens += usage.output_tokens;
        cumulative_cost += usage.cost;
        const results = {
          outputs: parser ? outputs.map((o) => {
            try {
              const content = parser(o.content);
              return __spreadProps(__spreadValues({}, o), { content });
            } catch (err) {
              throw new errors.ParserError(
                err instanceof Error ? err.message : "Unexpected error parseing the model output"
              );
            }
          }) : outputs,
          original,
          usage: {
            input_tokens: cumulative_input_tokens,
            output_tokens: cumulative_output_tokens,
            cost: cumulative_cost,
            retries
          }
        };
        return results;
      } catch (error) {
        if (error instanceof errors.AbortError || (signal == null ? void 0 : signal.aborted)) {
          throw new errors.AbortError();
        }
        let strategy = fallbacks == null ? void 0 : fallbacks[error == null ? void 0 : error.contructor.name];
        if (strategy && strategy.after >= max_retries) {
          const c = strategy.models.findIndex(
            (m) => m.provider === current.provider && m.model === current.model
          );
          const next = strategy.models[Math.min(c + 1, strategy.models.length - 1)];
          let parameters = next.parameters;
          if (!parameters) {
            parameters = next.provider === config.provider ? config.parameters : next.provider === current.provider ? current.parameters : config.parameters ? (0, import_getProvider.getProvider)(next.provider).parametersFromProvider(
              config.provider,
              config.parameters
            ) : void 0;
          }
          current = {
            provider: next.provider,
            model: next.model,
            parameters
          };
          continue;
        }
        if (retries < max_retries && error instanceof errors.RateLimitError) {
          delay = 2e3 * 2 ** retries;
          yield new Promise((resolve) => setTimeout(resolve, delay));
        } else if (retries < max_retries && error instanceof errors.ParserError && retry_if_parser_fails) {
          continue;
        } else {
          run_error = error;
          break;
        }
      }
    }
    return {
      outputs: [],
      original: null,
      error: run_error,
      usage: {
        input_tokens: cumulative_input_tokens,
        output_tokens: cumulative_output_tokens,
        cost: cumulative_cost,
        retries
      }
    };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  runPrompt
});
