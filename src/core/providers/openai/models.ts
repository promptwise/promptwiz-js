import { ModelData } from "../../types";
import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel,
} from "../shared";

export const models = {
  // Prev gen models - Shutdown 2024-06-13
  "gpt-4-0314": ["openai_100k", 8192, 3, 6] as ModelData,
  "gpt-4-32k-0314": ["openai_100k", 32768, 6, 12] as ModelData,
  "gpt-3.5-turbo-0301": ["openai_100k", 4096, 0.15, 0.2] as ModelData,
  "gpt-4-0613": ["openai_100k", 8192, 3, 6] as ModelData,
  "gpt-4-32k-0613": ["openai_100k", 32768, 6, 12] as ModelData,
  "gpt-3.5-turbo-0613": ["openai_100k", 4096, 0.15, 0.2] as ModelData,
  "gpt-3.5-turbo-16k-0613": ["openai_100k", 16384, 0.3, 0.4] as ModelData,
  // Current model checkpoints
  "gpt-4-1106-preview": ["openai_100k", 128000, 1, 3] as ModelData, // Also called gpt-4-turbo but so far not explicitly as it's own model
  "gpt-4-vision-preview": ["openai_100k", 128000, 1, 3] as ModelData,
  "gpt-3.5-turbo-1106": ["openai_100k", 16384, 0.1, 0.2] as ModelData,
  // Current models
  "text-embedding-ada-002": ["openai_100k", 2049, 0.2, 0.2] as ModelData,
  "gpt-4": ["openai_100k", 8192, 3, 6] as ModelData, // currently points to gpt-4-0613
  "gpt-4-32k": ["openai_100k", 32768, 6, 12] as ModelData, // currently points to gpt-4-32k-0613
  "gpt-3.5-turbo": ["openai_100k", 4096, 0.1, 0.2] as ModelData, // currently points to gpt-3.5-turbo-0613
  "gpt-3.5-turbo-16k": ["openai_100k", 16384, 0.1, 0.2] as ModelData, // currently points to gpt-3.5-turbo-16k-0613
  "gpt-3.5-turbo-instruct": ["openai_100k", 4096, 0.15, 0.2] as ModelData,
} as const;

export type OpenAIModel = keyof typeof models;

export const promptDollarCostForModel = (
  model: OpenAIModel,
  input_tokens: number,
  output_tokens: number
) => _promptDollarCostForModel(models, model, input_tokens, output_tokens);

export const maxTokensForModel = (model: OpenAIModel) =>
  _maxTokensForModel(models, model);

export const encoderNameForModel = (model: OpenAIModel) =>
  _encoderNameForModel(models, model) as "openai_100k" | "openai_50k";
