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
