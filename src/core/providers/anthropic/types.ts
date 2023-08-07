
export type AnthropicCompletion = {
  completion: string;
  stop_reason: null | "max_tokens" | "stop_sequence";
  model: string;
};
export type AnthropicParameters = {
  max_tokens_to_sample?: number;
  temperature?: number; // 0.0 - 1.0
  top_k?: number; // 0 - Infinity?
  top_p?: number; // 0.0 - 1.0
  stop_sequences?: string[]; // end output on any of these and include them in the output
  stream?: boolean;
};