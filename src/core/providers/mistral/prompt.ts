import { ProviderPrompt } from "../../types";
import { MistralCompletion, MistralParameters } from "./types";
import { MistralModel, promptDollarCostForModel } from "./models";
import { tokenizer } from "./tokenizer";
import { generate } from "./generate";

export const prompt: ProviderPrompt<
  MistralModel,
  MistralParameters,
  MistralCompletion
> = (config) =>
  generate(config).then((original) => {
    const { choices, usage } = original;
    // If only a single output then we can just piggy-back on Mistral's token count
    if (choices.length === 1) {
      return {
        outputs: [
          {
            content: choices[0].message.content,
            tokens: usage.completion_tokens,
            truncated: choices[0].finish_reason === "length",
          },
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
          retries: 0,
        },
      };
    }

    const _tokenizer = tokenizer(config.model);

    return {
      outputs: choices.map(
            ({ message, finish_reason }) => ({
              content: message.content,
              tokens: _tokenizer.count(message.content),
              truncated: finish_reason === "length",
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
        retries: 0,
      },
    };
  });
