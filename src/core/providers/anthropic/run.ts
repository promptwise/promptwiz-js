import { ProviderRun } from "../../types";
import { hydratePromptInputs } from "../../utils";
import { runPrompt } from "../runPrompt";
import { AnthropicParameters, AnthropicCompletion } from "./types";
import { AnthropicModel } from "./models";
import { prompt } from "./prompt";

export const run: ProviderRun<
  AnthropicModel,
  AnthropicParameters,
  AnthropicCompletion
> = ({ prompt: input_prompt, inputs, ...config }) =>
  runPrompt<any>(
    // @ts-expect-error - later
    {
      ...config,
      prompt: inputs ? hydratePromptInputs(input_prompt, inputs) : input_prompt,
    },
    prompt
  );
