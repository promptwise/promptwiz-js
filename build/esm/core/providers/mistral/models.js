import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel
} from "../shared";
const models = {
  "mistral-tiny": ["mistral_32k", 131072, 1526e-7, 4578e-7],
  "mistral-small": ["mistral_32k", 131072, 654e-6, 1962e-6],
  "mistral-medium": ["mistral_32k", 131072, 2725e-6, 8175e-6]
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
