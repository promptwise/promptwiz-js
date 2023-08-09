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
import {
  parametersFromProvider,
  maxGenerationsPerPrompt,
  maxTemperature,
  minTemperature,
  parameters,
} from "./parameters";

export const cohere: PromptProviderModule<
  CohereModel,
  CohereParameters,
  CohereCompletion
> = {
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
