import { ChatMessage } from "../../types";
export type OpenAIFinishReason = null | "stop" | "length" | "function_call" | "content_filter";
export type OpenAICompletion = {
    choices: Array<{
        text: string;
        finish_reason: OpenAIFinishReason;
    } | {
        message: ChatMessage;
        finish_reason: OpenAIFinishReason;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
export type OpenAIParameters = {
    n?: number;
    max_tokens?: number;
    temperature?: number;
    top_k?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stop?: string[];
    logit_bias?: Record<number, number>;
    stream?: boolean;
};
