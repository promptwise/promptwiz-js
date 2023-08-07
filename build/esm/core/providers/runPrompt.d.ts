import { PromptwizControllerConfig, PromptwizOutput } from "../types";
export declare function runPrompt<O = string>({ max_retries, retry_if_parser_fails, parser, signal, }: PromptwizControllerConfig<O>, runner: () => Promise<PromptwizOutput<string>>): Promise<PromptwizOutput<O>>;
