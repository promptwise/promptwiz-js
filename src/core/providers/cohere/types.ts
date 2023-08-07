export type CohereCompletion = {
  id: string;
  prompt: string;
  generations: Array<{
    id: string;
    text: string;
    index: number;
  }>;
  meta: {};
};

export type CohereParameters = {
  num_generations?: number; // 1 - 5
  max_tokens?: number;
  temperature?: number; // 0.0 - 5.0
  k?: number; // 0 - 500
  p?: number; // 0.0 - 1.0 (0 or 1 to disable, otherwise it's a probability)
  frequency_penalty?: number; // 0.0 - 1.0
  presence_penalty?: number; // 0.0 - 1.0
  end_sequences?: string[]; // end output on any of these and exclude them from the output
  stop_sequences?: string[]; // end output on any of these and include them in the output
  logit_bias?: Record<number, number>; // keys are tokens, values: -10 - 10
  stream?: boolean;
};
