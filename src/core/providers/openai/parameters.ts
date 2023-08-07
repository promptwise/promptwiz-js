import { AnthropicParameters } from "../anthropic/types";
import { CohereParameters } from "../cohere/types";
import { OpenAIParameters } from "./types";

export function maxGenerationsPerPrompt(): number {
  return 16;
}

export function maxTemperature(): number {
  return 2;
}

export function minTemperature(): number {
  return 0;
}

export function parametersFromProvider<PP extends Record<string, unknown>>(
  provider: string,
  params: PP
): OpenAIParameters {
  if (provider === "cohere") return parametersFromCohere(params);
  if (provider === "anthropic") return parametersFromAnthropic(params);
  throw new Error(`Unsupported provider: '${provider}'`);
}

export function parametersFromAnthropic(
  params: AnthropicParameters
): OpenAIParameters {
  const result: OpenAIParameters = { n: 1 };
  if (params.max_tokens_to_sample != null)
    result.max_tokens = params.max_tokens_to_sample;
  if (params.temperature != null) result.temperature = params.temperature / 2;
  if (params.top_k != null) result.top_k = params.top_k;
  if (params.top_p != null) result.top_p = params.top_p;
  if (Array.isArray(params.stop_sequences) && params.stop_sequences.length)
    result.stop = params.stop_sequences;
  if (params.stream != null) result.stream = params.stream;

  return result;
}

export function parametersFromCohere(
  params: CohereParameters
): OpenAIParameters {
  const result: OpenAIParameters = {};
  if (params.num_generations) result.n = params.num_generations;
  if (params.max_tokens != null) result.max_tokens = params.max_tokens;
  if (params.temperature != null) result.temperature = params.temperature * 0.4;
  if (params.k != null) {
    result.top_k = params.k;
  }
  if (params.p != null) {
    result.top_p = params.p;
    if (params.p === 0.00000000001) result.top_p = 0;
    if (params.p === 0.99999999999) result.top_p = 1;
  }
  if (params.frequency_penalty != null)
    result.frequency_penalty = params.frequency_penalty * 4 - 2;
  if (params.presence_penalty != null)
    result.presence_penalty = params.presence_penalty * 4 - 2;
  if (Array.isArray(params.stop_sequences) && params.stop_sequences.length)
    result.stop = params.stop_sequences;
  if (params.stream != null) result.stream = params.stream;

  return result;
}
