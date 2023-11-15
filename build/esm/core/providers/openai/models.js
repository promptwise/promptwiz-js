import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel
} from "../shared";
const models = {
  "gpt-4-0314": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k-0314": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo-0301": ["openai_100k", 4096, 0.15, 0.2],
  "gpt-4-0613": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k-0613": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo-0613": ["openai_100k", 4096, 0.15, 0.2],
  "gpt-3.5-turbo-16k-0613": ["openai_100k", 16384, 0.3, 0.4],
  "gpt-4-1106-preview": ["openai_100k", 128e3, 1, 3],
  "gpt-4-vision-preview": ["openai_100k", 128e3, 1, 3],
  "gpt-3.5-turbo-1106": ["openai_100k", 16384, 0.1, 0.2],
  "text-embedding-ada-002": ["openai_100k", 2049, 0.2, 0.2],
  "gpt-4": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo": ["openai_100k", 4096, 0.1, 0.2],
  "gpt-3.5-turbo-16k": ["openai_100k", 16384, 0.1, 0.2],
  "gpt-3.5-turbo-instruct": ["openai_100k", 4096, 0.15, 0.2]
};
const promptDollarCostForModel = (model, input_tokens, output_tokens) => _promptDollarCostForModel(models, model, input_tokens, output_tokens);
const maxTokensForModel = (model) => _maxTokensForModel(models, model);
const encoderNameForModel = (model) => _encoderNameForModel(models, model);
export {
  encoderNameForModel,
  maxTokensForModel,
  models,
  promptDollarCostForModel
};
