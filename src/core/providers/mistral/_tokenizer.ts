import { ChatMessage } from "../../types";
import { template_regex } from "../../utils";
import { TiktokenOptions } from "../tiktoken";
import { vocab_base64, merges_binary } from "./_encodings";

function base64decode(encodedString: string) {
  return atob(encodedString);
}

function decodeVocabulary(vocab_base64: string): string[] {
  const byteArray = Uint8Array.from(base64decode(vocab_base64), (c) =>
    c.charCodeAt(0)
  );
  const textDecoder = new TextDecoder("utf-8");
  return textDecoder.decode(byteArray).split("\n");
}

function utf8ByteToHex(c: number): string {
  const hexValue = c.toString(16).toUpperCase().padStart(2, "0");
  return `<0x${hexValue}>`;
}

function hexToUtf8Byte(hex: string): number {
  const strippedHex = hex.replace(/<0x|>/g, "");
  return parseInt(strippedHex, 16);
}

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8");

class PriorityQueue<N> {
  _heap: N[];
  _comparator: (a: N, b: N) => boolean;
  // PriorityQueue implementation is copied from https://stackoverflow.com/a/42919752 with minor refactoring
  constructor(comparator = (a: N, b: N) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[0];
  }
  // @ts-expect-error - later
  push(...values) {
    values.forEach((value) => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > 0) {
      this._swap(0, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  // @ts-expect-error - later
  replace(value) {
    const replacedValue = this.peek();
    this._heap[0] = value;
    this._siftDown();
    return replacedValue;
  }
  _parent(i: number) {
    return ((i + 1) >>> 1) - 1;
  }
  _left(i: number) {
    return (i << 1) + 1;
  }
  _right(i: number) {
    return (i + 1) << 1;
  }
  _greater(i: number, j: number) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i: number, j: number) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > 0 && this._greater(node, this._parent(node))) {
      this._swap(node, this._parent(node));
      node = this._parent(node);
    }
  }
  _siftDown() {
    let node = 0;
    while (
      (this._left(node) < this.size() &&
        this._greater(this._left(node), node)) ||
      (this._right(node) < this.size() &&
        this._greater(this._right(node), node))
    ) {
      let maxChild =
        this._right(node) < this.size() &&
        this._greater(this._right(node), this._left(node))
          ? this._right(node)
          : this._left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

type PriorityNode = {
  origPos: number;
  mergePrio: number;
  mergeToString: string;
  deleted: boolean;
  tokenId: number;
  prev: null | PriorityNode;
  next: null | PriorityNode;
};

export class MistralTiktoken {
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
  protected vocabByString = new Map<string, number>();

  /** @internal */
  protected merges = new Map<string, number>();

  constructor(options?: TiktokenOptions) {
    this.chat_message_extra_tokens = options?.chat_message_extra_tokens || 0;
    this.chat_messages_extra_tokens = options?.chat_messages_extra_tokens || 0;
    this.vocabById = decodeVocabulary(vocab_base64);
    this.specialTokens = {
      ...options?.extendedSpecialTokens,
    };
    this.inverseSpecialTokens = Object.entries(this.specialTokens).reduce<
      Record<number, Uint8Array>
    >((memo, [text, rank]) => {
      memo[rank] = utf8Encoder.encode(text);
      return memo;
    }, {});
    // Map where key represents tokenString, value represents tokenId
    this.vocabByString = new Map();
    this.vocabById.forEach((tokenString, tokenId) => {
      this.vocabByString.set(tokenString, tokenId);
    });
    this.merges = this.decompressMerges(merges_binary);
  }

  private getMergeIdentifierString(
    firstTokenId: number,
    secondTokenId: number
  ): string {
    return this.vocabById[firstTokenId] + " " + this.vocabById[secondTokenId];
  }

  private decompressMerges(merges_binary: string): Map<string, number> {
    // Base64 decode binary.
    const byteArrayString = base64decode(merges_binary);

    // Convert byteArrayString to byteArray.
    const byteArray = new Uint8Array(byteArrayString.length);
    for (let i = 0; i < byteArrayString.length; i++) {
      byteArray[i] = byteArrayString.charCodeAt(i);
    }

    // Each byte-pair represents a tokenId.
    // Convert byte-pairs to tokenIds (integers between 0 and 32000).
    const tokenIds = [];
    for (let i = 0; i < byteArray.length; i += 2) {
      const byte1 = byteArray[i];
      const byte2 = byteArray[i + 1];
      const tokenId = byte1 + (byte2 << 8);
      tokenIds.push(tokenId);
    }

    // Each pair of tokenIds represents a merge.
    const merges = new Map();
    for (let i = 0; i < tokenIds.length; i += 2) {
      const id1 = tokenIds[i];
      const id2 = tokenIds[i + 1];
      const mergeIdentifierString = this.getMergeIdentifierString(id1, id2);
      // Key identifies token pair, value represents merge priority
      merges.set(mergeIdentifierString, i + 1);
    }
    return merges;
  }

  private mapCharactersToTokenIds(prompt: string): number[] {
    const tokenIds: number[] = [];
    // Special: spaces are represented as thick underscore ▁ (id 28705)
    const promptAltered = prompt.replaceAll(" ", this.vocabById[28705]);
    // We need to use Array.from to iterate over characters in order to support UTF-8 multipoint characters
    const charArray = Array.from(promptAltered);
    // Transform each character to its corresponding token
    for (let i = 0; i < charArray.length; i++) {
      const c = charArray[i];
      if (this.vocabByString.has(c)) {
        // Typical case
        tokenIds.push(this.vocabByString.get(c) as number);
      } else {
        // Special case where token not found and we have to fallback to byte-level tokens.
        const bytes = utf8Encoder.encode(c);
        for (let j = 0; j < bytes.length; j++) {
          const hex = this.vocabByString.get(utf8ByteToHex(bytes[j])) as number;
          tokenIds.push(hex);
          if (!(hex >= 0)) {
            // This is not supposed to happen because the mistral vocabulary has a token corresponding to each byte,
            // but if this happens regardless, let's follow the protocol and tokenize to <UNK> token instead of crashing.
            console.log(
              "Encountered unknown character " +
                c +
                " (partial UTF-8 byte " +
                bytes[j] +
                " + hex + " +
                utf8ByteToHex(bytes[j]) +
                ")"
            );
            tokenIds[tokenIds.length - 1] = 0;
          }
        }
      }
    }
    return tokenIds;
  }

  encode(prompt: string, preserve_templates = false): number[] {
    if (prompt.length === 0) {
      return [];
    }
    if (!preserve_templates) {
      prompt = prompt.replaceAll(template_regex, "");
    }

    // Initially each character is transformed to a tokenId, later there will be merges of these.
    const tokenIds = this.mapCharactersToTokenIds(prompt);

    // Set up priority queue to efficiently iterate merge possibilities in priority order
    const mergeQueue = new PriorityQueue<PriorityNode>((a, b) => {
      return a.mergePrio < b.mergePrio;
    });
    const addToMergeQueue = (leftNode: PriorityNode) => {
      const mergeIdentifierString = this.getMergeIdentifierString(
        leftNode.tokenId,
        leftNode.next!.tokenId
      );
      // Merge priority is primarily determined by the location of the merge in the "merges" data,
      // secondarily determined by the relative position of the node in the linked list
      // (We want to perform equal merges from left to right)
      const mergePrio =
        (this.merges.get(mergeIdentifierString) || 0) +
        leftNode.origPos / prompt.length;
      if (mergePrio) {
        // If mergePrio not found in merges, that means this merge is not possible according to vocabulary.
        leftNode.mergePrio = mergePrio;
        leftNode.mergeToString = mergeIdentifierString.replace(" ", "");
        mergeQueue.push(leftNode);
      }
    };

    // Fill merge queue from initial merge possibilities and construct linked list
    let firstTokenNode = {
      origPos: 0,
      tokenId: tokenIds[0],
      prev: null,
      next: null,
    } as PriorityNode;
    let prevTokenNode = firstTokenNode;
    for (let i = 1; i < tokenIds.length; i++) {
      const currTokenNode = {
        origPos: i,
        tokenId: tokenIds[i],
        prev: prevTokenNode,
        next: null,
      } as PriorityNode;
      prevTokenNode.next = currTokenNode;
      addToMergeQueue(prevTokenNode);
      prevTokenNode = currTokenNode;
    }

    // Perform merges in priority order
    while (!mergeQueue.isEmpty()) {
      const leftOfMerge = mergeQueue.pop();
      // Check that this merge is still possible
      if (leftOfMerge.deleted) continue;
      if (!leftOfMerge.next) continue;
      if (leftOfMerge.next.deleted) continue;

      // Mark leftOfMerge and rightOfMerge as being deleted, because they are actually being replaced by a merged token.
      leftOfMerge.deleted = true;
      leftOfMerge.next.deleted = true;
      // It's a little bit more complicated to fix the prev of leftOfMerge.
      if (leftOfMerge.prev) {
        const oldPrev = leftOfMerge.prev;
        // Mark oldPrev as deleted, to avoid erroneous merges later (ref to this node might exist in priorityqueue)
        oldPrev.deleted = true;
        // Replace oldPrev within the linked list with a copy of itself
        const newPrev = {
          origPos: oldPrev.origPos,
          tokenId: oldPrev.tokenId,
          prev: oldPrev.prev,
          next: oldPrev.next,
        } as PriorityNode;
        leftOfMerge.prev = newPrev;
        // Update linked list reference of "prev of prev"
        if (newPrev.prev) {
          newPrev.prev.next = newPrev;
        } else {
          // If "prev of prev" does not exist, that means newPrev must be the new firstNode
          firstTokenNode = newPrev;
        }
      }
      // Create node representing merge result
      const resultOfMerge = {
        origPos: leftOfMerge.origPos,
        tokenId: this.vocabByString.get(leftOfMerge.mergeToString),
        prev: leftOfMerge.prev,
        next: leftOfMerge.next.next,
      } as PriorityNode;
      // Consider adding to merge queue: prev--resultOfMerge
      if (resultOfMerge.prev) {
        resultOfMerge.prev.next = resultOfMerge;
        resultOfMerge.prev;
        addToMergeQueue(resultOfMerge.prev);
      } else {
        // If prev does not exist then this is the new firstNode
        firstTokenNode = resultOfMerge;
      }
      // Consider adding to merge queue: resultOfMerge--next
      if (resultOfMerge.next) {
        resultOfMerge.next.prev = resultOfMerge;
        addToMergeQueue(resultOfMerge);
      }
    }

    // Get final tokenIds by traversing the linked list
    const mergedTokenIds = [];
    for (
      let currTokenNode: PriorityNode | null = firstTokenNode;
      currTokenNode !== null;
      currTokenNode = currTokenNode.next
    ) {
      mergedTokenIds.push(currTokenNode.tokenId);
    }
    return mergedTokenIds;
  }

  decodeTokens(tokenIds: number[]): string[] {
    const utf8byteVals = [];
    const startIndex = 0;
    for (let i = startIndex; i < tokenIds.length; i++) {
      const tokenId = tokenIds[i];
      let tokenString =
        this.vocabById[tokenId] ?? this.inverseSpecialTokens[tokenId];
      if (tokenString.startsWith("<0x") && tokenString.endsWith(">")) {
        // Special case
        const utf8byte = hexToUtf8Byte(tokenString);
        utf8byteVals.push(utf8byte);
      } else {
        // Typical case
        const utf8bytes = utf8Encoder.encode(tokenString);
        utf8bytes.forEach((utf8Byte) => utf8byteVals.push(utf8Byte));
      }
    }
    return utf8byteVals.map((tok) =>
      utf8Decoder
        .decode(new Uint8Array([tok]))
        .replaceAll(this.vocabById[28705], " ")
    );
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
