import { OpenAIParameters } from "../openai/types";
export declare function maxGenerationsPerPrompt(): number;
export declare function maxTemperature(): number;
export declare function minTemperature(): number;
export declare function parametersFromProvider<PP extends Record<string, unknown>>(provider: string, params: PP): OpenAIParameters;
