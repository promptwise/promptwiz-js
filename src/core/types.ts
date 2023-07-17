export type PromptOutput = {
  content: string;
  tokens: number;
  truncated: boolean;
};

export type PromptwizOutput = {
  outputs: PromptOutput[];
  original: any; // Original result of the provider's prompt api
};

export type ChatPrompt = Array<{ role: string; content: string }>;
export type Prompt = string | ChatPrompt;

export type PromptwizConfig = {
  provider: {
    name: "openai";
    access_token: string;
    model: string;
    parameters?: Record<string, unknown>;
  };
  controller?: {
    max_retries?: number; // defaults to 3
    parser?: <R>(output: string) => R; // throw an error to retry
  };
  prompt: Prompt;
};

export type StreamHandler = (token: string, done: boolean) => unknown;

export type Promptwiz<Inputs extends Record<string, string> | void = void> = {
  readonly is_running: boolean;
  run(): PromiseLike<PromptwizOutput>;
  run(inputs: Inputs): PromiseLike<PromptwizOutput>;
  // stream(handler: StreamHandler): PromiseLike<PromptwizOutput>;
  // stream(inputs: Inputs, handler: StreamHandler): PromiseLike<PromptwizOutput>;
  config(config: Partial<PromptwizConfig>): Promptwiz<Inputs>;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant" | string;
  content: string;
};

export type PromptProvider = (
  provider: PromptwizConfig["provider"],
  prompt: PromptwizConfig["prompt"],
  signal: AbortSignal,
) => Promise<PromptwizOutput>;

export type Optional<
  P extends Record<string, unknown> = Record<string, unknown>,
  K extends string = string
> = Omit<P, K> & Partial<Pick<P, K>>;

export interface ModelTokenizer {
  encode(text: string, preserve_templates?: boolean): number[];
  decode(tokens: number[]): string;
  decodeTokens(tokens: number[]): string[];
  decodeToken(tokens: number): string;
  count(
    value: string | ChatMessage | Array<ChatMessage>,
    preserve_templates?: boolean
  ): number;
}

export interface PromptProviderModule {
  // Run the prompt given the input and config
  runPrompt(
    provider: PromptwizConfig["provider"],
    prompt: PromptwizConfig["prompt"],
    signal: AbortSignal,
  ): Promise<PromptwizOutput>;

  // Get tokenizer for the model
  getTokenizer(model: string, specialTokens?: Record<string, number>): ModelTokenizer;

  // Get the max token context window size for the model
  maxTokensForModel(model: string): number;

  // Get the cost in dollars of a prompt
  pricePerPrompt(model: string, input_tokens: number, output_tokens: number): number;
}