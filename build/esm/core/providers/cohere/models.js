import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel
} from "../shared";
const models = {
  command: ["cohere_75k", 2048, 0.15, 0.2],
  "command-light": ["cohere_75k", 2048, 0.15, 0.2],
  "command-nightly": ["cohere_75k", 2048, 0.15, 0.2],
  "command-light-nightly": ["cohere_75k", 2048, 0.15, 0.2]
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
