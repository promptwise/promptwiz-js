import { ProviderPrompt } from "../../types";
import { CohereParameters, CohereCompletion } from "./types";
import { CohereModel, promptDollarCostForModel } from "./models";
import { tokenizer } from "./tokenizer";
import { generate } from "./generate";

export const prompt: ProviderPrompt<
  CohereModel,
  CohereParameters,
  CohereCompletion
> = (config) =>
  generate(config).then((original) => {
    const isChatPrompt = Array.isArray(prompt);
    const _tokenizer = tokenizer(config.model);
    const outputs = !isChatPrompt
      ? // @ts-expect-error - needs fixed
        original.generations.map(({ text }) => {
          const tokens = _tokenizer.count(text);
          return {
            content: text,
            tokens,
            // Cohere does not indicate when the output was truncated due to reaching the max_tokens limit
            // If we've hit the limit and the text produced does not appear to end in any of our specified stop_sequences, then we assume it was truncated
            truncated:
              tokens >= (config.parameters?.max_tokens || 20) &&
              (!config.parameters?.stop_sequences ||
                config.parameters?.stop_sequences.every(
                  (seq: string) => !text.endsWith(seq)
                )),
          };
        })
      : [
          {
            // @ts-expect-error - needs fixed
            content: original.text,
            // @ts-expect-error - needs fixed
            tokens: _tokenizer.count(original.text),
            truncated: false, // guessing!
          },
        ];
    const input_tokens = _tokenizer.count(config.prompt);
    // @ts-expect-error - needs fixed
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
        retries: 0,
      },
    };
  });
