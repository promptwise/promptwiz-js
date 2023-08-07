import { ChatMessage } from "../types";
export interface TiktokenBPE {
    pat_str: string;
    special_tokens: Record<string, number>;
    bpe_ranks: string;
}
export interface TiktokenOptions {
    chat_message_extra_tokens: number;
    chat_messages_extra_tokens: number;
    extendedSpecialTokens?: Record<string, number>;
}
export declare class Tiktoken {
    /** @internal */
    protected specialTokens: Record<string, number>;
    /** @internal */
    protected inverseSpecialTokens: Record<number, Uint8Array>;
    /** @internal */
    protected patStr: string;
    /** @internal */
    protected textEncoder: TextEncoder;
    /** @internal */
    protected textDecoder: TextDecoder;
    /** @internal */
    protected rankMap: Map<string, number>;
    /** @internal */
    protected textMap: Map<number, Uint8Array>;
    /** @internal */
    protected chat_message_extra_tokens: number;
    /** @internal */
    protected chat_messages_extra_tokens: number;
    constructor(ranks: TiktokenBPE, options?: TiktokenOptions);
    private static specialTokenRegex;
    encode(text: string, preserve_templates?: boolean, allowedSpecial?: Array<string> | "all", disallowedSpecial?: Array<string> | "all"): number[];
    decodeTokens(tokens: number[]): string[];
    decode(tokens: number[]): string;
    decodeToken(token: number): string;
    count(value: string | ChatMessage | Array<ChatMessage>, preserve_templates?: boolean): number;
}
