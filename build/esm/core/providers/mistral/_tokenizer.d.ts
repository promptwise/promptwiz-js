import { ChatMessage } from "../../types";
import { TiktokenOptions } from "../tiktoken";
export declare class MistralTiktoken {
    /** @internal */
    protected specialTokens: Record<string, number>;
    /** @internal */
    protected inverseSpecialTokens: Record<number, Uint8Array>;
    /** @internal */
    protected chat_message_extra_tokens: number;
    /** @internal */
    protected chat_messages_extra_tokens: number;
    /** @internal */
    protected vocabById: string[];
    /** @internal */
    protected vocabByString: Map<string, number>;
    /** @internal */
    protected merges: Map<string, number>;
    constructor(options?: TiktokenOptions);
    private getMergeIdentifierString;
    private decompressMerges;
    private mapCharactersToTokenIds;
    encode(prompt: string, preserve_templates?: boolean): number[];
    decodeTokens(tokenIds: number[]): string[];
    decode(tokens: number[]): string;
    decodeToken(token: number): string;
    count(value: string | ChatMessage | Array<ChatMessage>, preserve_templates?: boolean): number;
}
