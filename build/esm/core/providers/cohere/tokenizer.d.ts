import { Tiktoken } from "../tiktoken";
import { CohereModel } from "./models";
export declare const tokenizer: (model: CohereModel, extendedSpecialTokens?: Record<string, number>) => Tiktoken;
