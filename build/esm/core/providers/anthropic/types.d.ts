export type AnthropicCompletion = {
    completion: string;
    stop_reason: null | "max_tokens" | "stop_sequence";
    model: string;
};
export type AnthropicParameters = {
    max_tokens_to_sample?: number;
    temperature?: number;
    top_k?: number;
    top_p?: number;
    stop_sequences?: string[];
    stream?: boolean;
};
