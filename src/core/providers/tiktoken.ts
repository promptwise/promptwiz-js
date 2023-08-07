import { ChatMessage } from "../types";
import { template_regex } from "../utils";

function bytePairMerge(
  piece: Uint8Array,
  ranks: Map<string, number>
): Array<{ start: number; end: number }> {
  let parts: Array<{ start: number; end: number }> = Array.from(
    { length: piece.length },
    (_, i) => ({ start: i, end: i + 1 })
  );

  while (parts.length > 1) {
    let minRank: [number, number] | null = null;

    for (let i = 0; i < parts.length - 1; i++) {
      const slice = piece.slice(parts[i].start, parts[i + 1].end);
      const rank = ranks.get(slice.join(","));
      if (rank == null) continue;

      if (minRank == null || rank < minRank[0]) {
        minRank = [rank, i];
      }
    }

    if (minRank != null) {
      const i = minRank[1];
      parts[i] = { start: parts[i].start, end: parts[i + 1].end };
      parts.splice(i + 1, 1);
    } else {
      break;
    }
  }
  return parts;
}

function bytePairEncode(piece: Uint8Array, ranks: Map<string, number>) {
  if (piece.length === 1) return [ranks.get(piece.join(","))!];

  return bytePairMerge(piece, ranks)
    .map((p) => ranks.get(piece.slice(p.start, p.end).join(",")))
    .filter((x): x is number => x != null);
}

function escapeRegex(str: string) {
  return str.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
}

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

export class Tiktoken {
  /** @internal */
  protected specialTokens: Record<string, number>;

  /** @internal */
  protected inverseSpecialTokens: Record<number, Uint8Array>;

  /** @internal */
  protected patStr: string;

  /** @internal */
  protected textEncoder = new TextEncoder();

  /** @internal */
  protected textDecoder = new TextDecoder("utf-8");

  /** @internal */
  protected rankMap = new Map<string, number>();

  /** @internal */
  protected textMap = new Map<number, Uint8Array>();

  /** @internal */
  protected chat_message_extra_tokens: number;

  /** @internal */
  protected chat_messages_extra_tokens: number;

  constructor(ranks: TiktokenBPE, options?: TiktokenOptions) {
    this.patStr = ranks.pat_str;
    this.chat_message_extra_tokens = options?.chat_message_extra_tokens || 0;
    this.chat_messages_extra_tokens = options?.chat_messages_extra_tokens || 0;

    const uncompressed = ranks.bpe_ranks
      .split("\n")
      .filter(Boolean)
      .reduce<Record<string, number>>((memo, x) => {
        const [_, offsetStr, ...tokens] = x.split(" ");
        const offset = Number.parseInt(offsetStr, 10);
        tokens.forEach((token, i) => (memo[token] = offset + i));
        return memo;
      }, {});

    for (const [token, rank] of Object.entries(uncompressed)) {
      const bytes = Uint8Array.from(
        atob(token),
        (m) => m.codePointAt(0) as number
      );
      this.rankMap.set(bytes.join(","), rank);
      this.textMap.set(rank, bytes);
    }

    this.specialTokens = {
      ...ranks.special_tokens,
      ...options?.extendedSpecialTokens,
    };
    this.inverseSpecialTokens = Object.entries(this.specialTokens).reduce<
      Record<number, Uint8Array>
    >((memo, [text, rank]) => {
      memo[rank] = this.textEncoder.encode(text);
      return memo;
    }, {});
  }

  private static specialTokenRegex = (tokens: string[]) => {
    return new RegExp(tokens.map((i) => escapeRegex(i)).join("|"), "g");
  };

  encode(
    text: string,
    preserve_templates = false,
    allowedSpecial: Array<string> | "all" = [],
    disallowedSpecial: Array<string> | "all" = "all"
  ): number[] {
    if (!preserve_templates) {
      text = text.replaceAll(template_regex, "");
    }

    const regexes = new RegExp(this.patStr, "ug");
    const specialRegex = Tiktoken.specialTokenRegex(
      Object.keys(this.specialTokens)
    );

    const ret: number[] = [];

    const allowedSpecialSet = new Set(
      allowedSpecial === "all"
        ? Object.keys(this.specialTokens)
        : allowedSpecial
    );

    const disallowedSpecialSet = new Set(
      disallowedSpecial === "all"
        ? Object.keys(this.specialTokens).filter(
            (x) => !allowedSpecialSet.has(x)
          )
        : disallowedSpecial
    );

    if (disallowedSpecialSet.size > 0) {
      const disallowedSpecialRegex = Tiktoken.specialTokenRegex([
        ...disallowedSpecialSet,
      ]);

      const specialMatch = text.match(disallowedSpecialRegex);
      if (specialMatch != null) {
        throw new Error(
          `The text contains a special token that is not allowed: ${specialMatch[0]}`
        );
      }
    }

    let start = 0;
    while (true) {
      let nextSpecial: RegExpMatchArray | null = null;
      let startFind = start;

      while (true) {
        specialRegex.lastIndex = startFind;
        nextSpecial = specialRegex.exec(text);
        if (nextSpecial == null || allowedSpecialSet.has(nextSpecial[0])) break;
        startFind = nextSpecial.index! + 1;
      }

      const end = nextSpecial?.index ?? text.length;
      for (const match of text.substring(start, end).matchAll(regexes)) {
        const piece = this.textEncoder.encode(match[0]);
        const token = this.rankMap.get(piece.join(","));

        if (token != null) {
          ret.push(token);
          continue;
        }

        ret.push(...bytePairEncode(piece, this.rankMap));
      }

      if (nextSpecial == null) break;
      let token = this.specialTokens[nextSpecial[0]];
      ret.push(token);

      start = nextSpecial.index! + nextSpecial[0].length;
    }

    return ret;
  }

  decodeTokens(tokens: number[]): string[] {
    const res: Uint8Array[] = [];
    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i];
      const bytes = this.textMap.get(token) ?? this.inverseSpecialTokens[token];

      if (bytes != null) {
        res.push(bytes);
      }
    }
    return res.map((bytes) => this.textDecoder.decode(bytes));
  }

  decode(tokens: number[]): string {
    return this.decodeTokens(tokens).join("");
  }

  decodeToken(token: number): string {
    return this.decodeTokens([token])[0];
  }

  count(
    value: string | ChatMessage | Array<ChatMessage>,
    preserve_templates = false
  ): number {
    if (typeof value === "string") return this.encode(value).length;
    if (!Array.isArray(value))
      return (
        this.encode(value.content, preserve_templates).length +
        this.chat_message_extra_tokens
      );
    // tokenize each message individually and add them up
    return value.reduce(
      (sum, msg) =>
        sum +
        this.encode(msg.content, preserve_templates).length +
        this.chat_message_extra_tokens,
      this.chat_messages_extra_tokens
    );
  }
}
