import { ModelData } from "../../types";
import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel,
} from "../shared";

export const models = {
  // Current models
  // Mistral model use is priced in Euros.
  // We convert Euro pricing to USD here at the conversion rate of 1 EURO to 1.09 USD
  "mistral-tiny": ["mistral_32k", 131072, 0.0001526, 0.0004578] as ModelData,
  "mistral-small": ["mistral_32k", 131072, 0.000654, 0.001962] as ModelData,
  "mistral-medium": ["mistral_32k", 131072, 0.002725, 0.008175] as ModelData,
} as const;

export type MistralModel = keyof typeof models;

export const promptDollarCostForModel = (
  model: MistralModel,
  input_tokens: number,
  output_tokens: number
) => _promptDollarCostForModel(models, model, input_tokens, output_tokens);

export const maxTokensForModel = (model: MistralModel) =>
  _maxTokensForModel(models, model);

export const encoderNameForModel = (model: MistralModel) =>
  _encoderNameForModel(models, model) as "mistral_32k";
