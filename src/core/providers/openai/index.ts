import { PromptProviderModule } from "../../types";
import {
  OpenAIModel,
  promptDollarCostForModel,
  maxTokensForModel,
} from "./models";
import { tokenizer } from "./tokenizer";
import { OpenAICompletion, OpenAIParameters } from "./types";
import { generate } from "./generate";
import { prompt } from "./prompt";
import { run } from "./run";
import { api } from "./api";
import {
  parametersFromProvider,
  maxGenerationsPerPrompt,
  maxTemperature,
  minTemperature,
  parameters,
} from "./parameters";

export * from "./response";
export const openai: PromptProviderModule<
  OpenAIModel,
  OpenAIParameters,
  OpenAICompletion
> = {
  api,
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
  parameters,
};
