import { Tiktoken } from "../tiktoken";
import { AnthropicModel } from "./models";
export declare const tokenizer: (model: AnthropicModel, extendedSpecialTokens?: Record<string, number>) => Tiktoken;
