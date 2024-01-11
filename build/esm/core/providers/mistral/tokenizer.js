import { MistralTiktoken } from "./_tokenizer";
let _encoder_cache = null;
const tokenizer = (model, extendedSpecialTokens) => {
  let encoder = _encoder_cache || new MistralTiktoken({
    chat_message_extra_tokens: 7,
    chat_messages_extra_tokens: 0,
    extendedSpecialTokens
  });
  _encoder_cache = encoder;
  return encoder;
};
export {
  tokenizer
};
