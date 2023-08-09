import { Promptwiz, PromptwizConfig, PromptwizOutput } from "./types";
import { getProvider } from "./getProvider";

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

    async run(inputs?: Inputs): Promise<PromptwizOutput> {
      if (is_running)
        throw new Error("Cannot run while another prompt is already running.");
      is_running = true;
      ac = new AbortController();
      return getProvider(config.provider)
        .run({ ...config, inputs })
        .then((res) => {
          is_running = false;
          return res;
        });
    },
    // stream(
    //   inputsOrHandler: Inputs | StreamHandler,
    //   handler: StreamHandler
    // ): Promise<PromptwizOutput> {
    // TODO: implement streaming with option for streaming parser
    // },
  };
  return promptwizInstance;
}
