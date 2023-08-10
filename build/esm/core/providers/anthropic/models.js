import {
  _promptDollarCostForModel,
  _maxTokensForModel,
  _encoderNameForModel
} from "../shared";
const models = {
  "claude-1": ["anthropic_64k", 1e5, 1.102, 3.268],
  "claude-instant-1.1": ["anthropic_64k", 1e5, 0.163, 0.551],
  "claude-instant-1.2": ["anthropic_64k", 1e5, 0.163, 0.551],
  "claude-2.0": ["anthropic_64k", 1e5, 1.102, 3.268],
  "claude-instant-1": ["anthropic_64k", 1e5, 0.163, 0.551],
  "claude-2": ["anthropic_64k", 1e5, 1.102, 3.268]
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
