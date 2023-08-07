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
> = ({
  provider,
  model,
  access_token,
  parameters,
  prompt: input_prompt,
  inputs,
  ...controller
}) =>
  runPrompt(controller, () =>
    prompt({
      model,
      access_token,
      parameters,
      prompt: inputs ? hydratePromptInputs(input_prompt, inputs) : input_prompt,
      signal: controller.signal,
    })
  );
