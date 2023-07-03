export type PromptwizOutput = {
  output: string;
  tokens: number;
  truncated: boolean;
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
  run(): PromiseLike<PromptwizOutput[]>;
  run(inputs: Inputs): PromiseLike<PromptwizOutput[]>;
  // stream(handler: StreamHandler): PromiseLike<PromptwizOutput[]>;
  // stream(inputs: Inputs, handler: StreamHandler): PromiseLike<PromptwizOutput[]>;
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
) => Promise<PromptwizOutput[]>;

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
  runPrompt(
    provider: PromptwizConfig["provider"],
    prompt: PromptwizConfig["prompt"],
    signal: AbortSignal,
  ): Promise<PromptwizOutput[]>;

  getTokenizer(model: string): ModelTokenizer;

  maxTokensForModel(model: string): number;
}