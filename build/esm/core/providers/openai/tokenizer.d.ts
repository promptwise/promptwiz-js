import { Tiktoken } from "../tiktoken";
import { OpenAIModel } from "./models";
export declare const tokenizer: (model: OpenAIModel, extendedSpecialTokens?: Record<string, number>) => Tiktoken;
