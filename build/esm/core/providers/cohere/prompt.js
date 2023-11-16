import { promptDollarCostForModel } from "./models";
import { tokenizer } from "./tokenizer";
import { generate } from "./generate";
const prompt = (config) => generate(config).then((original) => {
  const isChatPrompt = Array.isArray(prompt);
  const _tokenizer = tokenizer(config.model);
  const outputs = !isChatPrompt ? original.generations.map(({ text }) => {
    var _a, _b, _c;
    const tokens = _tokenizer.count(text);
    return {
      content: text,
      tokens,
      truncated: tokens >= (((_a = config.parameters) == null ? void 0 : _a.max_tokens) || 20) && (!((_b = config.parameters) == null ? void 0 : _b.stop_sequences) || ((_c = config.parameters) == null ? void 0 : _c.stop_sequences.every(
        (seq) => !text.endsWith(seq)
      )))
    };
  }) : [
    {
      content: original.text,
      tokens: _tokenizer.count(original.text),
      truncated: false
    }
  ];
  const input_tokens = _tokenizer.count(config.prompt);
  const output_tokens = outputs.reduce((sum, o) => sum + o.tokens, 0);
  return {
    outputs,
    original,
    usage: {
      input_tokens,
      output_tokens,
      cost: promptDollarCostForModel(
        config.model,
        input_tokens,
        output_tokens
      ),
      retries: 0
    }
  };
});
export {
  prompt
};
