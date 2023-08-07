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
import * as errors from "../errors";
async function runPrompt({
  max_retries = 3,
  retry_if_parser_fails = true,
  parser,
  signal
}, runner) {
  let retries = -1;
  let delay = 0;
  let cumulative_input_tokens = 0;
  let cumulative_output_tokens = 0;
  let cumulative_cost = 0;
  let run_error;
  while (++retries <= max_retries) {
    try {
      if (signal == null ? void 0 : signal.aborted)
        throw new errors.AbortError();
      const { outputs, original, usage } = await runner();
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
}
export {
  runPrompt
};
