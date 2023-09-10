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
import { getProvider } from "./getProvider";
import { runPrompt } from "./providers/runPrompt";
import { hydratePromptInputs } from "./utils";
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
    async run(inputs) {
      if (is_running)
        throw new Error("Cannot run while another prompt is already running.");
      is_running = true;
      ac = new AbortController();
      return runPrompt(
        config,
        (_config) => getProvider(_config.provider).prompt(__spreadProps(__spreadValues({}, _config), {
          prompt: inputs ? hydratePromptInputs(_config.prompt, inputs) : _config.prompt
        }))
      ).then((res) => {
        is_running = false;
        return res;
      });
    }
  };
  return promptwizInstance;
}
export {
  promptwiz
};
