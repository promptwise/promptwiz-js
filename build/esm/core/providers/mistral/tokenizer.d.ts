import { Tiktoken } from "../tiktoken";
import { MistralModel } from "./models";
export declare const tokenizer: (model: MistralModel, extendedSpecialTokens?: Record<string, number>) => Tiktoken;
