function _promptDollarCostForModel(records, model, input_tokens, output_tokens) {
  const record = records[model];
  if (!record)
    throw new Error(`Invalid or unsupported model '${model}' for provider.`);
  const input_cents_per_token = record[2] / 1e3;
  const output_cents_per_token = record[3] / 1e3;
  input_tokens = Math.ceil(Math.max(0, input_tokens));
  output_tokens = Math.ceil(Math.max(0, output_tokens));
  return (input_cents_per_token * input_tokens + output_cents_per_token * output_tokens) / 100;
}
function _maxTokensForModel(records, model) {
  const record = records[model];
  if (!record)
    throw new Error(`Invalid or unsupported model '${model}' for provider.`);
  return record[1];
}
function _encoderNameForModel(records, model) {
  const record = records[model];
  if (!record)
    throw new Error(`Invalid or unsupported model '${model}' for provider.`);
  return record[0];
}
export {
  _encoderNameForModel,
  _maxTokensForModel,
  _promptDollarCostForModel
};
