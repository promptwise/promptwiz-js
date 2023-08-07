import { ModelData } from "../../types";
import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel,
} from "../shared";

export const models = {
  // 1st Gen models - Shutdown: 2024-01-04
  "text-similarity-davinci-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "text-similarity-curie-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "text-similarity-babbage-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "text-similarity-ada-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "text-search-davinci-doc-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "text-search-curie-doc-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "text-search-babbage-doc-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "text-search-ada-doc-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "code-search-babbage-code-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "code-search-ada-code-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  // Base GPT models - Shutdown: 2024-01-04
  davinci: ["openai_50k", 2049, 2, 2] as ModelData,
  curie: ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  babbage: ["openai_50k", 2049, 0.05, 0.05] as ModelData,
  ada: ["openai_50k", 2049, 0.04, 0.04] as ModelData,
  // InstructGPT models - Shutdown: 2024-01-04
  "text-davinci-003": ["openai_50k", 4097, 2, 2] as ModelData,
  "text-davinci-002": ["openai_50k", 4097, 2, 2] as ModelData,
  "text-davinci-001": ["openai_50k", 2049, 2, 2] as ModelData,
  "text-curie-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "text-babbage-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  "text-ada-001": ["openai_50k", 2049, 0.2, 0.2] as ModelData,
  // Prev gen models - Shutdown 2024-06-13
  "gpt-4-0314": ["openai_100k", 8192, 3, 6] as ModelData,
  "gpt-4-32k-0314": ["openai_100k", 32768, 6, 12] as ModelData,
  "gpt-3.5-turbo-0301": ["openai_100k", 4096, 0.15, 0.2] as ModelData,
  // Current model checkpoints
  "gpt-4-0613": ["openai_100k", 8192, 3, 6] as ModelData,
  "gpt-4-32k-0613": ["openai_100k", 32768, 6, 12] as ModelData,
  "gpt-3.5-turbo-16k-0613": ["openai_100k", 16384, 0.3, 0.4] as ModelData,
  // Current models
  "text-embedding-ada-002": ["openai_100k", 2049, 0.2, 0.2] as ModelData,
  "gpt-4": ["openai_100k", 8192, 3, 6] as ModelData,
  "gpt-4-32k": ["openai_100k", 32768, 6, 12] as ModelData,
  "gpt-3.5-turbo": ["openai_100k", 4096, 0.15, 0.2] as ModelData,
  "gpt-3.5-turbo-16k": ["openai_100k", 16384, 0.3, 0.4] as ModelData,
  "gpt-3.5-turbo-instruct": ["openai_100k", 4096, 0, 0] as ModelData, // TODO: unreleased
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
