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
import * as errors from "../errors";
import { getProvider } from "../getProvider";
async function runPrompt(_a, promptRunner) {
  var _b = _a, {
    max_retries = 3,
    retry_if_parser_fails = true,
    parser,
    signal,
    fallbacks,
    access_token
  } = _b, config = __objRest(_b, [
    "max_retries",
    "retry_if_parser_fails",
    "parser",
    "signal",
    "fallbacks",
    "access_token"
  ]);
  let retries = -1;
  let delay = 0;
  let cumulative_input_tokens = 0;
  let cumulative_output_tokens = 0;
  let cumulative_cost = 0;
  let run_error;
  let TOKEN = access_token;
  let current = {
    provider: config.provider,
    model: config.model,
    parameters: config.parameters || {},
    prompt: config.prompt
  };
  let used_fallback = false;
  while (++retries <= max_retries) {
    try {
      if (signal == null ? void 0 : signal.aborted)
        throw new errors.AbortError();
      const { outputs, original, usage } = await promptRunner(__spreadProps(__spreadValues(__spreadValues({}, config), current), {
        access_token: TOKEN
      }));
      cumulative_input_tokens += usage.input_tokens;
      cumulative_output_tokens += usage.output_tokens;
      cumulative_cost += usage.cost;
      const results = __spreadValues({
        outputs: parser ? outputs.map((o) => {
          try {
            const content = parser(o.content);
            return __spreadProps(__spreadValues({}, o), { content, original: o.content });
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
        },
        used_fallback
      }, current);
      return results;
    } catch (error) {
      if (error instanceof errors.AbortError || (signal == null ? void 0 : signal.aborted)) {
        throw new errors.AbortError();
      }
      let strategy = fallbacks == null ? void 0 : fallbacks[error == null ? void 0 : error.contructor.name];
      if (strategy && strategy.after >= max_retries) {
        used_fallback = true;
        const c = strategy.models.findIndex(
          (m) => m.provider === current.provider && m.model === current.model
        );
        const _next = strategy.models[Math.min(c + 1, strategy.models.length - 1)];
        let parameters = _next.parameters;
        if (!parameters) {
          parameters = _next.provider === config.provider ? config.parameters : _next.provider === current.provider ? current.parameters : config.parameters ? getProvider(_next.provider).parametersFromProvider(
            config.provider,
            config.parameters
          ) : void 0;
        }
        const _a2 = _next, { access_token: token } = _a2, next = __objRest(_a2, ["access_token"]);
        TOKEN = token;
        current = __spreadProps(__spreadValues({}, next), {
          provider: next.provider,
          model: next.model,
          parameters: parameters || {},
          prompt: next.prompt || current.prompt
        });
        continue;
      }
      if (retries < max_retries && error instanceof errors.RateLimitError) {
        delay = 2e3 * 2 ** retries;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else if (retries < max_retries && error instanceof errors.ParserError && retry_if_parser_fails) {
        continue;
      } else {
        run_error = error;
        break;
      }
    }
  }
  return __spreadValues({
    outputs: [],
    original: null,
    error: run_error,
    usage: {
      input_tokens: cumulative_input_tokens,
      output_tokens: cumulative_output_tokens,
      cost: cumulative_cost,
      retries
    },
    used_fallback
  }, current);
}
export {
  runPrompt
};
