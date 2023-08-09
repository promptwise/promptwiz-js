import {
  promptDollarCostForModel,
  maxTokensForModel
} from "./models";
import { tokenizer } from "./tokenizer";
import { generate } from "./generate";
import { prompt } from "./prompt";
import { run } from "./run";
import {
  parametersFromProvider,
  maxGenerationsPerPrompt,
  maxTemperature,
  minTemperature,
  parameters
} from "./parameters";
const cohere = {
  generate,
  prompt,
  run,
  tokenizer,
  promptDollarCostForModel,
  maxTokensForModel,
  parametersFromProvider,
  maxGenerationsPerPrompt,
  maxTemperature,
  minTemperature,
  parameters
};
export {
  cohere
};
