import { hydratePromptInputs } from "./utils/hydratePromptInputs";
import * as providers from "./providers";
import {
  Promptwiz,
  PromptwizConfig,
  PromptwizOutput,
  // StreamHandler,
} from "./types";
import * as errors from "./errors";

export function promptwiz<Inputs extends Record<string, string> | void = void>(
  config: PromptwizConfig
): Promptwiz<Inputs> {
  let is_running = false;
  const promptwizInstance: Promptwiz<Inputs> = {

    get is_running() {
      return is_running;
    },

    config(update: Partial<PromptwizConfig>): Promptwiz<Inputs> {
      if (update.prompt) {
        config.prompt = update.prompt;
      }
      if (update.controller) {
        config.controller = update.controller;
      }
      if (update.prompt) {
        config.prompt = update.prompt;
      }
      return promptwizInstance;
    },

    async run(inputs?: Inputs): Promise<PromptwizOutput[]> {
      is_running = true;
      const prompt = inputs
        ? hydratePromptInputs(config.prompt, inputs)
        : config.prompt;
      const provider = providers[config.provider.name];

      let retries = -1;
      let delay = 2000;
      const { max_retries = 3, parser } = config.controller || {};
      const ac = new AbortController();

      let outputs: PromptwizOutput[] = [];
      while (++retries <= max_retries) {
        try {
          if (ac.signal.aborted) throw new errors.AbortError();
          outputs = await provider.runPrompt(
            config.provider,
            prompt,
            ac.signal
          );
          outputs = parser
            ? outputs.map((o) => ({ ...o, output: parser(o.content) }))
            : outputs;
        } catch (error) {
          if (error instanceof errors.AbortError || ac.signal.aborted) {
            is_running = false;
            throw new errors.AbortError();
          }
          if (
            retries === max_retries ||
            error instanceof errors.AuthorizationError
          ) {
            is_running = false;
            throw error;
          }
          if (error instanceof errors.RateLimitError) {
            // Retry the atomic step with exponential backoff
            delay *= 2 ** retries;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
      is_running = false;
      return outputs;
    },
    // stream(
    //   inputsOrHandler: Inputs | StreamHandler,
    //   handler: StreamHandler
    // ): Promise<PromptwizOutput> {

    // },
  };
  return promptwizInstance;
}
