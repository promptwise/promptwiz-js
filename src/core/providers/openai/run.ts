import { ProviderRun } from "../../types";
import { hydratePromptInputs } from "../../utils";
import { runPrompt } from "../runPrompt";
import { OpenAIParameters, OpenAICompletion } from "./types";
import { OpenAIModel } from "./models";
import { prompt } from "./prompt";

export const run: ProviderRun<
  OpenAIModel,
  OpenAIParameters,
  OpenAICompletion
> = ({ prompt: input_prompt, inputs, ...config }) =>
  runPrompt<any>(
    // @ts-expect-error - later
    {
      ...config,
      prompt: inputs ? hydratePromptInputs(input_prompt, inputs) : input_prompt,
    },
    prompt
  );
