import { AnthropicParameters } from "../anthropic/types";
import { CohereParameters } from "../cohere/types";
import { OpenAIParameters } from "../openai/types";
import { MistralParameters } from "./types";

export function parameters<K extends keyof MistralParameters>(
  params: Pick<MistralParameters, K>
): MistralParameters {
  return params;
}

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
): MistralParameters {
  if (provider === "cohere") return parametersFromCohere(params);
  if (provider === "anthropic") return parametersFromAnthropic(params);
  if (provider === "openai") return parametersFromOpenAI(params);
  throw new Error(`Unsupported provider: '${provider}'`);
}

export function parametersFromOpenAI(
  params: OpenAIParameters
): MistralParameters {
  const result: MistralParameters = {};
  if (params.max_tokens != null) result.max_tokens = params.max_tokens;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature * 0.5, 1));
  if (params.top_p != null) {
    result.top_p = params.top_p;
    if (params.top_p === 0.00000000001) result.top_p = 0;
    if (params.top_p === 0.99999999999) result.top_p = 1;
  }
  if (params.stream != null) result.stream = params.stream;

  return result;
}

export function parametersFromAnthropic(
  params: AnthropicParameters
): MistralParameters {
  const result: MistralParameters = {};
  if (params.max_tokens_to_sample != null)
    result.max_tokens = params.max_tokens_to_sample;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature / 2, 2));
  if (params.top_p != null) result.top_p = params.top_p;
  if (params.stream != null) result.stream = params.stream;

  return result;
}

export function parametersFromCohere(
  params: CohereParameters
): MistralParameters {
  const result: MistralParameters = {};
  if (params.max_tokens != null) result.max_tokens = params.max_tokens;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature * 0.4, 2));
  if (params.p != null) {
    result.top_p = params.p;
    if (params.p === 0.00000000001) result.top_p = 0;
    if (params.p === 0.99999999999) result.top_p = 1;
  }
  if (params.stream != null) result.stream = params.stream;

  return result;
}
