import { promptDollarCostForModel } from "./models";
import { tokenizer } from "./tokenizer";
import { generate } from "./generate";
const prompt = (config) => generate(config).then((original) => {
  const { choices, usage } = original;
  if (choices.length === 1) {
    return {
      outputs: [
        {
          content: choices[0].message.content,
          tokens: usage.completion_tokens,
          truncated: choices[0].finish_reason === "length"
        }
      ],
      original,
      usage: {
        input_tokens: usage.prompt_tokens,
        output_tokens: usage.completion_tokens,
        cost: promptDollarCostForModel(
          config.model,
          usage.prompt_tokens,
          usage.completion_tokens
        ),
        retries: 0
      }
    };
  }
  const _tokenizer = tokenizer(config.model);
  return {
    outputs: choices.map(
      ({ message, finish_reason }) => ({
        content: message.content,
        tokens: _tokenizer.count(message.content),
        truncated: finish_reason === "length"
      })
    ),
    original,
    usage: {
      input_tokens: usage.prompt_tokens,
      output_tokens: usage.completion_tokens,
      cost: promptDollarCostForModel(
        config.model,
        usage.prompt_tokens,
        usage.completion_tokens
      ),
      retries: 0
    }
  };
});
export {
  prompt
};
