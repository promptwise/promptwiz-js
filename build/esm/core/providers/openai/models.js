import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel
} from "../shared";
const models = {
  "text-similarity-davinci-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-similarity-curie-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-similarity-babbage-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-similarity-ada-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-search-davinci-doc-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-search-curie-doc-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-search-babbage-doc-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-search-ada-doc-001": ["openai_50k", 2049, 0.2, 0.2],
  "code-search-babbage-code-001": ["openai_50k", 2049, 0.2, 0.2],
  "code-search-ada-code-001": ["openai_50k", 2049, 0.2, 0.2],
  davinci: ["openai_50k", 2049, 2, 2],
  curie: ["openai_50k", 2049, 0.2, 0.2],
  babbage: ["openai_50k", 2049, 0.05, 0.05],
  ada: ["openai_50k", 2049, 0.04, 0.04],
  "text-davinci-003": ["openai_50k", 4097, 2, 2],
  "text-davinci-002": ["openai_50k", 4097, 2, 2],
  "text-davinci-001": ["openai_50k", 2049, 2, 2],
  "text-curie-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-babbage-001": ["openai_50k", 2049, 0.2, 0.2],
  "text-ada-001": ["openai_50k", 2049, 0.2, 0.2],
  "gpt-4-0314": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k-0314": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo-0301": ["openai_100k", 4096, 0.15, 0.2],
  "gpt-4-0613": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k-0613": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo-16k-0613": ["openai_100k", 16384, 0.3, 0.4],
  "text-embedding-ada-002": ["openai_100k", 2049, 0.2, 0.2],
  "gpt-4": ["openai_100k", 8192, 3, 6],
  "gpt-4-32k": ["openai_100k", 32768, 6, 12],
  "gpt-3.5-turbo": ["openai_100k", 4096, 0.15, 0.2],
  "gpt-3.5-turbo-16k": ["openai_100k", 16384, 0.3, 0.4],
  "gpt-3.5-turbo-instruct": ["openai_100k", 4096, 0, 0]
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
