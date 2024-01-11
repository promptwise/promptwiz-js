import { ChatMessage } from "../../types";

export type MistralFinishReason =
  | null
  | "stop"
  | "length"
  | "content_filter";

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
  max_tokens?: number; // 1 - depends on model
  temperature?: number; // 0.0 - 1.0
  top_p?: number; // 0.0 - 1.0
  stream?: boolean;
  user?: string; // unique identifier to ID your user (if desired)
};
