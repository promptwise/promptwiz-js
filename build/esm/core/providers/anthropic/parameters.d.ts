import { OpenAIParameters } from "../openai/types";
import { AnthropicParameters } from "./types";
export declare function parameters<K extends keyof AnthropicParameters>(params: Pick<AnthropicParameters, K>): AnthropicParameters;
export declare function maxGenerationsPerPrompt(): number;
export declare function maxTemperature(): number;
export declare function minTemperature(): number;
export declare function parametersFromProvider<PP extends Record<string, unknown>>(provider: string, params: PP): OpenAIParameters;
