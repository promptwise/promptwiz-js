import { ProviderModelRecord } from "../types";

export function _promptDollarCostForModel(
  records: ProviderModelRecord,
  model: string,
  input_tokens: number,
  output_tokens: number
): number {
  const record = records[model as keyof typeof records];
  if (!record)
    throw new Error(`Invalid or unsupported model '${model}' for provider.`);

  const input_cents_per_token = record[2] / 1000;
  const output_cents_per_token = record[3] / 1000;

  input_tokens = Math.ceil(Math.max(0, input_tokens));
  output_tokens = Math.ceil(Math.max(0, output_tokens));
  // Returns dollar amount
  return (
    (input_cents_per_token * input_tokens +
      output_cents_per_token * output_tokens) /
    100
  );
}

export function _maxTokensForModel(
  records: ProviderModelRecord,
  model: string
): number {
  const record = records[model as keyof typeof records];
  if (!record)
    throw new Error(`Invalid or unsupported model '${model}' for provider.`);
  return record[1];
}

export function _encoderNameForModel(
  records: ProviderModelRecord,
  model: string
): string {
  const record = records[model as keyof typeof records];
  if (!record)
    throw new Error(`Invalid or unsupported model '${model}' for provider.`);
  return record[0];
}
