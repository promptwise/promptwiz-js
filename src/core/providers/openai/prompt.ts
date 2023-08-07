import { ProviderPrompt } from "../../types";
import { OpenAICompletion, OpenAIParameters } from "./types";
import { OpenAIModel, promptDollarCostForModel } from "./models";
import { tokenizer } from "./tokenizer";
import { generate } from "./generate";

export const prompt: ProviderPrompt<
  OpenAIModel,
  OpenAIParameters,
  OpenAICompletion
> = (config) =>
  generate(config).then((original) => {
    const isChatModel =
      config.model.includes("gpt-3.5") || config.model.includes("gpt-4");
    const { choices, usage } = original;
    // If only a single output then we can just piggy-back on OpenAI's token count
    if (choices.length === 1) {
      return {
        outputs: [
          {
            // @ts-expect-error
            content: isChatModel ? choices[0].message.content : choices[0].text,
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
        isChatModel
          ? // @ts-expect-error - later
            ({ message, finish_reason }) => ({
              content: message.content,
              tokens: _tokenizer.count(message.content),
              truncated: finish_reason === "length",
            })
          : // @ts-expect-error - later
            ({ text, finish_reason }) => ({
              content: text,
              tokens: _tokenizer.count(text),
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
