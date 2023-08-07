var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
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
import { hydratePromptInputs } from "../../utils";
import { runPrompt } from "../runPrompt";
import { prompt } from "./prompt";
const run = (_a) => {
  var _b = _a, {
    provider,
    model,
    access_token,
    parameters,
    prompt: input_prompt,
    inputs
  } = _b, controller = __objRest(_b, [
    "provider",
    "model",
    "access_token",
    "parameters",
    "prompt",
    "inputs"
  ]);
  return runPrompt(
    controller,
    () => prompt({
      model,
      access_token,
      parameters,
      prompt: inputs ? hydratePromptInputs(input_prompt, inputs) : input_prompt,
      signal: controller.signal
    })
  );
};
export {
  run
};
