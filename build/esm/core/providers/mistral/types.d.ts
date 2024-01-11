import { ChatMessage } from "../../types";
export type MistralFinishReason = null | "stop" | "length" | "content_filter";
export type MistralCompletion = {
    choices: Array<{
        message: ChatMessage;
        finish_reason: MistralFinishReason;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
export type MistralParameters = {
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    stream?: boolean;
    user?: string;
};
