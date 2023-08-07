import { ChatMessage } from "../../types";

export type OpenAIFinishReason =
  | null
  | "stop"
  | "length"
  | "function_call"
  | "content_filter";

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
  n?: number; // 1 - 16
  max_tokens?: number; // 1 - depends on model
  temperature?: number; // 0.0 - 2.0
  top_k?: number; // 0 - 500
  top_p?: number; // 0.0 - 1.0
  frequency_penalty?: number; // -2.0 - 2.0
  presence_penalty?: number; // -2.0 - 2.0
  stop?: string[]; // end output on any of these and include them in the output
  logit_bias?: Record<number, number>; // keys are tokens, values: -10 - 10
  stream?: boolean;
};
