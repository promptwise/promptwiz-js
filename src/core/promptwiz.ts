import {
  Promptwiz,
  PromptwizConfig,
  PromptwizOutput,
  StreamHandler,
} from "./types";
import { getProvider } from "./getProvider";
import { runPrompt } from "./providers/runPrompt";
import { hydratePromptInputs } from "./utils";

export function promptwiz<Inputs extends Record<string, string>>(
  config: PromptwizConfig
): Promptwiz<Inputs> {
  config = { ...config };
  let is_running = false;
  let ac: AbortController | null = null;
  const promptwizInstance: Promptwiz<Inputs> = {
    get is_running() {
      return is_running;
    },

    config(update: Partial<PromptwizConfig>): Promptwiz<Inputs> {
      config = { ...config, ...update };
      return promptwizInstance;
    },

    abort() {
      ac?.abort();
    },

    async api(inputs?: Inputs): Promise<Response> {
      return getProvider(config.provider).api({
        ...config,
        prompt: inputs
          ? hydratePromptInputs(config.prompt, inputs)
          : config.prompt,
      });
    },

    async run(inputs?: Inputs): Promise<PromptwizOutput> {
      if (is_running)
        throw new Error("Cannot run while another prompt is already running.");
      is_running = true;
      ac = new AbortController();

      return runPrompt(config, (_config) =>
        getProvider(_config.provider).prompt({
          ..._config,
          prompt: inputs
            ? hydratePromptInputs(_config.prompt, inputs)
            : _config.prompt,
        })
      ).then((res) => {
        is_running = false;
        return res;
      });
    },

    stream(
      inputsOrHandler: Inputs | StreamHandler,
      handler?: StreamHandler
    ): Promise<PromptwizOutput> {
      if (is_running)
        throw new Error("Cannot run while another prompt is already running.");
      is_running = true;
      ac = new AbortController();

      let inputs: Inputs | undefined;
      if (typeof inputsOrHandler === "function") {
        handler = inputsOrHandler;
      } else {
        inputs = inputsOrHandler;
        if (!handler) throw new Error("Missing stream handler function.");
      }

      return runPrompt(config, (_config) =>
        getProvider(_config.provider).prompt({
          ..._config,
          prompt: inputs
            ? hydratePromptInputs(_config.prompt, inputs)
            : _config.prompt,
          stream: handler,
        })
      ).then((res) => {
        is_running = false;
        return res;
      });
    },
  };
  return promptwizInstance;
}
