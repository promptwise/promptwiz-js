import { PromptProviderModule } from "../../types";
import {
  AnthropicModel,
  promptDollarCostForModel,
  maxTokensForModel,
} from "./models";
import { tokenizer } from "./tokenizer";
import { AnthropicCompletion, AnthropicParameters } from "./types";
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
export const anthropic: PromptProviderModule<
  AnthropicModel,
  AnthropicParameters,
  AnthropicCompletion
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
