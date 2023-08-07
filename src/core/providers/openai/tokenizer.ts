import { Tiktoken } from "../tiktoken";
import * as encodings from "./encodings";
import { encoderNameForModel, OpenAIModel } from "./models";

const _encoder_cache = new Map<string, Tiktoken>();

export const tokenizer = (
  model: OpenAIModel,
  extendedSpecialTokens?: Record<string, number>
) => {
  const encoding = encoderNameForModel(model);
  const encoder =
    _encoder_cache.get(encoding) ||
    new Tiktoken(encodings[encoding as keyof typeof encodings], {
      chat_message_extra_tokens: 5, // accounts for the delimiter and formating tokens inserted by OpenAI for every message
      chat_messages_extra_tokens: 3, // accounts for the trailing assistant message prompt that OpenAI appends to chat messages
      extendedSpecialTokens,
    });
  _encoder_cache.set(encoding, encoder);
  return encoder;
};
