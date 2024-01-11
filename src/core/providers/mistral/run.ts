import { ProviderRun } from "../../types";
import { hydratePromptInputs } from "../../utils";
import { runPrompt } from "../runPrompt";
import { MistralParameters, MistralCompletion } from "./types";
import { MistralModel } from "./models";
import { prompt } from "./prompt";

export const run: ProviderRun<
  MistralModel,
  MistralParameters,
  MistralCompletion
> = ({ prompt: input_prompt, inputs, ...config }) =>
  runPrompt<any>(
    // @ts-expect-error - later
    {
      ...config,
      prompt: inputs ? hydratePromptInputs(input_prompt, inputs) : input_prompt,
    },
    prompt
  );
