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
import { hydratePromptInputs } from "./utils/hydratePromptInputs";
import * as providers from "./providers";
import * as errors from "./errors";
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
    async run(inputs) {
      is_running = true;
      const prompt = inputs ? hydratePromptInputs(config.prompt, inputs) : config.prompt;
      const provider = providers[config.provider.name];
      let retries = -1;
      let delay = 2e3;
      const { max_retries = 3, parser } = config.controller || {};
      const ac = new AbortController();
      while (++retries <= max_retries) {
        try {
          if (ac.signal.aborted)
            throw new errors.AbortError();
          let { outputs, original } = await provider.runPrompt(
            config.provider,
            prompt,
            ac.signal
          );
          is_running = false;
          return {
            outputs: parser ? outputs.map((o) => __spreadProps(__spreadValues({}, o), { output: parser(o.content) })) : outputs,
            original
          };
        } catch (error) {
          if (error instanceof errors.AbortError || ac.signal.aborted) {
            is_running = false;
            throw new errors.AbortError();
          }
          if (retries < max_retries && error instanceof errors.RateLimitError) {
            delay *= 2 ** retries;
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            is_running = false;
            throw error;
          }
        }
      }
      is_running = false;
      return { outputs: [], original: null };
    }
  };
  return promptwizInstance;
}
export {
  promptwiz
};
