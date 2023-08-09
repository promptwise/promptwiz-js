import { ProviderRun } from "../../types";
import { hydratePromptInputs } from "../../utils";
import { runPrompt } from "../runPrompt";
import { CohereParameters, CohereCompletion } from "./types";
import { CohereModel } from "./models";
import { prompt } from "./prompt";

export const run: ProviderRun<
  CohereModel,
  CohereParameters,
  CohereCompletion
> = ({ prompt: input_prompt, inputs, ...config }) =>
  runPrompt<any>(
    // @ts-expect-error - later
    {
      ...config,
      prompt: inputs ? hydratePromptInputs(input_prompt, inputs) : input_prompt,
    },
    prompt
  );
