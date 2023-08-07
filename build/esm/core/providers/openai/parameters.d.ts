import { AnthropicParameters } from "../anthropic/types";
import { CohereParameters } from "../cohere/types";
import { OpenAIParameters } from "./types";
export declare function maxGenerationsPerPrompt(): number;
export declare function maxTemperature(): number;
export declare function minTemperature(): number;
export declare function parametersFromProvider<PP extends Record<string, unknown>>(provider: string, params: PP): OpenAIParameters;
export declare function parametersFromAnthropic(params: AnthropicParameters): OpenAIParameters;
export declare function parametersFromCohere(params: CohereParameters): OpenAIParameters;
