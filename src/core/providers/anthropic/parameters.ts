import { OpenAIParameters } from "../openai/types";
import { CohereParameters } from "../cohere/types";
import { AnthropicParameters } from "./types";

export function parameters<K extends keyof AnthropicParameters>(
  params: Pick<AnthropicParameters, K>
): AnthropicParameters {
  return params;
}

export function maxGenerationsPerPrompt(): number {
  return 1;
}

export function maxTemperature(): number {
  return 1;
}

export function minTemperature(): number {
  return 0;
}

export function parametersFromProvider<PP extends Record<string, unknown>>(
  provider: string,
  params: PP
): OpenAIParameters {
  if (provider === "openai") return parametersFromOpenAI(params);
  if (provider === "cohere") return parametersFromCohere(params);
  throw new Error(`Unsupported provider: '${provider}'`);
}

function parametersFromOpenAI(params: OpenAIParameters): AnthropicParameters {
  const result: AnthropicParameters = {};
  if (params.max_tokens != null)
    result.max_tokens_to_sample = params.max_tokens;
  if (params.temperature != null) result.temperature = params.temperature / 2;
  if (params.top_k != null) result.top_k = params.top_k;
  if (params.top_p != null) result.top_p = params.top_p;
  if (Array.isArray(params.stop) && params.stop.length)
    result.stop_sequences = params.stop;
  if (params.stream != null) result.stream = params.stream;

  return result;
}

function parametersFromCohere(params: CohereParameters): AnthropicParameters {
  const result: AnthropicParameters = {};
  if (params.max_tokens != null)
    result.max_tokens_to_sample = params.max_tokens;
  if (params.temperature != null) result.temperature = params.temperature / 5;
  if (params.k != null) {
    result.top_k = params.k;
  }
  if (params.p != null) {
    result.top_p = params.p;
    if (params.p === 0.00000000001) result.top_p = 0;
    if (params.p === 0.99999999999) result.top_p = 1;
  }
  if (Array.isArray(params.stop_sequences) && params.stop_sequences.length)
    result.stop_sequences = params.stop_sequences;
  if (params.stream != null) result.stream = params.stream;

  return result;
}
