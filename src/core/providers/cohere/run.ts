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
