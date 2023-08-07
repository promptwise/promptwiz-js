import { ProviderPrompt } from "../../types";
import { AnthropicParameters, AnthropicCompletion } from "./types";
import { AnthropicModel, promptDollarCostForModel } from "./models";
import { tokenizer } from "./tokenizer";
import { generate } from "./generate";

export const prompt: ProviderPrompt<
  AnthropicModel,
  AnthropicParameters,
  AnthropicCompletion
> = (config) =>
  generate(config).then((original) => {
    const _tokenizer = tokenizer(config.model);
    const input_tokens = _tokenizer.count(config.prompt);
    const output_tokens = _tokenizer.count(original.completion);
    return {
      outputs: [
        {
          content: original.completion,
          tokens: output_tokens,
          truncated: original.stop_reason === "max_tokens",
        },
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
        retries: 0,
      },
    };
  });
