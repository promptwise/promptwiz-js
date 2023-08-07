import { Tiktoken } from "../tiktoken";
import * as encodings from "./encodings";
import { encoderNameForModel } from "./models";
const _encoder_cache = /* @__PURE__ */ new Map();
const tokenizer = (model, extendedSpecialTokens) => {
  const encoding = encoderNameForModel(model);
  const encoder = _encoder_cache.get(encoding) || new Tiktoken(encodings[encoding], {
    chat_message_extra_tokens: 5,
    chat_messages_extra_tokens: 3,
    extendedSpecialTokens
  });
  _encoder_cache.set(encoding, encoder);
  return encoder;
};
export {
  tokenizer
};
