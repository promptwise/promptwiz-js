import { ModelData } from "../../types";
import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel,
} from "../shared";

export const models = {
  // Current model checkpoints
  command: ["cohere_75k", 2048, 1.5, 1.5] as ModelData,
  "command-light": ["cohere_75k", 2048, 1.5, 1.5] as ModelData,
  // Current models
  "command-nightly": ["cohere_75k", 2048, 1.5, 1.5] as ModelData,
  "command-light-nightly": ["cohere_75k", 2048, 1.5, 1.5] as ModelData,
} as const;

export type CohereModel = keyof typeof models;

export const promptDollarCostForModel = (
  model: CohereModel,
  input_tokens: number,
  output_tokens: number
) => _promptDollarCostForModel(models, model, input_tokens, output_tokens);

export const maxTokensForModel = (model: CohereModel) =>
  _maxTokensForModel(models, model);

export const encoderNameForModel = (model: CohereModel) =>
  _encoderNameForModel(models, model) as "cohere_75k";
