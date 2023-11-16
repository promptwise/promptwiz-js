import { FallbackErrors } from "./errors";
import { Tiktoken } from "./providers/tiktoken";
export type ProviderName = "openai" | "cohere" | "anthropic";
export type PromptOutput<T = string> = {
    original?: string;
    content: T;
    tokens: number;
    truncated: boolean;
};
export type PromptUsage = {
    input_tokens: number;
    output_tokens: number;
    cost: number;
    retries: number;
};
export type PromptwizOutput<O = string, T = any> = {
    outputs: PromptOutput<O>[];
    original: T;
    error?: Error;
    usage: PromptUsage;
    used_fallback: boolean;
    provider: ProviderName;
    model: string;
    prompt: Prompt;
    parameters: Record<string, unknown>;
};
export type ChatPrompt = Array<{
    role: string;
    content: string;
}>;
export type Prompt = string | ChatPrompt;
export type PromptwizControllerConfig<O> = {
    max_retries?: number;
    retry_if_parser_fails?: boolean;
    parser?: (output: string) => O;
    signal?: AbortSignal;
    stream?: StreamHandler;
};
export type PromptwizPromptBase<M extends string = string, P = Record<string, unknown>> = {
    provider: ProviderName;
    access_token: string;
    model: M;
    parameters?: P;
    prompt?: Prompt;
};
export type FallbackStrategy = {
    after: number;
    models: Array<PromptwizPromptBase>;
};
export type Fallbacks = Record<FallbackErrors, null | FallbackStrategy>;
export type PromptwizPromptConfig<M extends string = string, P = Record<string, unknown>> = Omit<PromptwizPromptBase<M, P>, "prompt"> & {
    prompt: Prompt;
    fallbacks?: Fallbacks;
};
export type PromptwizConfig<M extends string = string, P = Record<string, unknown>, O = string> = PromptwizPromptConfig<M, P> & PromptwizControllerConfig<O>;
export type PromptwizDelta<D extends string | Partial<ChatMessage> = Partial<ChatMessage>> = Array<{
    delta: D;
    index: number;
}>;
export type StreamHandler = (delta: PromptwizDelta, done: boolean) => unknown;
export type Promptwiz<Inputs extends Record<string, string> | void = void> = {
    readonly is_running: boolean;
    run(): PromiseLike<PromptwizOutput>;
    run(inputs: Inputs): PromiseLike<PromptwizOutput>;
    abort(): void;
    stream(handler: StreamHandler): PromiseLike<PromptwizOutput>;
    stream(inputs: Inputs, handler: StreamHandler): PromiseLike<PromptwizOutput>;
    config(config: Partial<PromptwizConfig>): Promptwiz<Inputs>;
};
export type ChatMessage = {
    role: "system" | "user" | "assistant" | string;
    content: string;
};
export type PromptProvider = (provider: PromptwizConfig["provider"], prompt: PromptwizConfig["prompt"], signal: AbortSignal) => Promise<PromptwizOutput>;
export type Optional<P extends Record<string, unknown> = Record<string, unknown>, K extends string = string> = Omit<P, K> & Partial<Pick<P, K>>;
export interface ModelTokenizer {
    encode(text: string, preserve_templates?: boolean): number[];
    decode(tokens: number[]): string;
    decodeTokens(tokens: number[]): string[];
    decodeToken(tokens: number): string;
    count(value: string | ChatMessage | Array<ChatMessage>, preserve_templates?: boolean): number;
}
export type ModelData = [
    encoding: string,
    token_window: number,
    input_cents_per_kilotoken: number,
    output_cents_per_kilotoken: number
];
export type ProviderModelRecord = Record<string, ModelData>;
export type ProviderGenerate<M extends string = string, P = Record<string, unknown>, T = any> = (config: Pick<PromptwizConfig<M, P, string>, "model" | "access_token" | "parameters" | "prompt" | "signal" | "stream">) => Promise<T>;
export type ProviderPrompt<M extends string = string, P = Record<string, unknown>, T = any> = (config: Pick<PromptwizConfig<M, P, string>, "provider" | "model" | "access_token" | "parameters" | "prompt" | "signal" | "stream">) => Promise<Pick<PromptwizOutput<string, T>, "outputs" | "original" | "usage">>;
export type ProviderRun<M extends string = string, P = Record<string, unknown>, T = any> = <O = any>(config: PromptwizConfig<M, P, O> & {
    inputs?: Record<string, string>;
}) => Promise<PromptwizOutput<O, T>>;
export interface PromptProviderModule<M extends string = string, P = Record<string, unknown>, T = any> {
    generate: ProviderGenerate<M, P, T>;
    prompt: ProviderPrompt<M, P, T>;
    run: ProviderRun<M, P, T>;
    tokenizer(model: M): Tiktoken;
    maxTokensForModel(model: M): number;
    maxGenerationsPerPrompt(): number;
    maxTemperature(): number;
    minTemperature(): number;
    promptDollarCostForModel(model: M, input_tokens: number, output_tokens: number): number;
    parametersFromProvider(provider: string, parameters: Record<string, unknown>): P;
    parameters<K extends keyof P>(params: Pick<P, K>): P;
}
