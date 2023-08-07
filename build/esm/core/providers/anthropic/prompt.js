import { promptDollarCostForModel } from "./models";
import { tokenizer } from "./tokenizer";
import { generate } from "./generate";
const prompt = (config) => generate(config).then((original) => {
  const _tokenizer = tokenizer(config.model);
  const input_tokens = _tokenizer.count(config.prompt);
  const output_tokens = _tokenizer.count(original.completion);
  return {
    outputs: [
      {
        content: original.completion,
        tokens: output_tokens,
        truncated: original.stop_reason === "max_tokens"
      }
    ],
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
