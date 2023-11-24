import { PromptProviderModule } from "../../types";
import {
  CohereModel,
  promptDollarCostForModel,
  maxTokensForModel,
} from "./models";
import { tokenizer } from "./tokenizer";
import { CohereCompletion, CohereParameters } from "./types";
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
export const cohere: PromptProviderModule<
  CohereModel,
  CohereParameters,
  CohereCompletion
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
