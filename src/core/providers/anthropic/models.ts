import { ModelData } from "../../types";
import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel,
} from "../shared";

export const models = {
  // Prev gen models - Shutdown ?? // TODO: get shutdown dates if any?
  "claude-1": ["anthropic_64k", 100_000, 1.102, 3.268] as ModelData,
  // Current model checkpoints
  "claude-instant-1.1": ["anthropic_64k", 100_000, 0.163, 0.551] as ModelData,
  "claude-instant-1.2": ["anthropic_64k", 100_000, 0.163, 0.551] as ModelData,
  "claude-2.0": ["anthropic_64k", 100_000, 1.102, 3.268] as ModelData,
  // Current models
  "claude-instant-1": ["anthropic_64k", 100_000, 0.163, 0.551] as ModelData,
  "claude-2": ["anthropic_64k", 100_000, 1.102, 3.268] as ModelData,
} as const;

export type AnthropicModel = keyof typeof models;

export const promptDollarCostForModel = (
  model: AnthropicModel,
  input_tokens: number,
  output_tokens: number
) => _promptDollarCostForModel(models, model, input_tokens, output_tokens);

export const maxTokensForModel = (model: AnthropicModel) =>
  _maxTokensForModel(models, model);

export const encoderNameForModel = (model: AnthropicModel) =>
  _encoderNameForModel(models, model) as "anthropic_64k";
