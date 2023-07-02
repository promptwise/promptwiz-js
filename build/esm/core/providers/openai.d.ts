import { ChatMessage, PromptProvider } from "../types";
export declare const runPrompt: PromptProvider;
export declare function getTokenizer(model: string): {
    encode(text: string, preserve_templates?: boolean): number[];
    decode: (tokens: number[]) => string;
    decodeTokens(tokens: number[]): string[];
    decodeToken(tokens: number): string;
    count(value: string | ChatMessage | Array<ChatMessage>, preserve_templates?: boolean): number;
};
export declare function maxTokensForModel(model: string): number;
