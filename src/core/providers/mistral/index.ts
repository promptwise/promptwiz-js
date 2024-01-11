import { PromptProviderModule } from "../../types";
import {
  MistralModel,
  promptDollarCostForModel,
  maxTokensForModel,
} from "./models";
import { tokenizer } from "./tokenizer";
import { MistralCompletion, MistralParameters } from "./types";
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
export const mistral: PromptProviderModule<
  MistralModel,
  MistralParameters,
  MistralCompletion
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
