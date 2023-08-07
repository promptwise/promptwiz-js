import { Tiktoken } from "../tiktoken";
import * as encodings from "./encodings";
import { encoderNameForModel, CohereModel } from "./models";

const _encoder_cache = new Map<string, Tiktoken>();

export const tokenizer = (
  model: CohereModel,
  extendedSpecialTokens?: Record<string, number>
) => {
  const encoding = encoderNameForModel(model);
  const encoder =
    _encoder_cache.get(encoding) ||
    new Tiktoken(encodings[encoding as keyof typeof encodings], {
      chat_message_extra_tokens: 5, // accounts for the ["\n","\n","User"/"Assistant",":"] we incude in every chat message
      chat_messages_extra_tokens: 5, // accounts for the ["\n","\n","Assistant",":"] tokens we append to every chat message sequence
      extendedSpecialTokens,
    });
  _encoder_cache.set(encoding, encoder);
  return encoder;
};
