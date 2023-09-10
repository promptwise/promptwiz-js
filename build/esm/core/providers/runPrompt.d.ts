import { PromptwizConfig, PromptwizOutput, ProviderPrompt } from "../types";
export declare function runPrompt<O = string>({ max_retries, retry_if_parser_fails, parser, signal, fallbacks, access_token, ...config }: PromptwizConfig, promptRunner: ProviderPrompt): Promise<PromptwizOutput<O>>;
