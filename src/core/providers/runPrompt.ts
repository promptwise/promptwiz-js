import { PromptwizConfig, PromptwizOutput, ProviderPrompt } from "../types";
import * as errors from "../errors";
import { getProvider } from "../getProvider";

export async function runPrompt<O = string>(
  {
    max_retries = 3,
    retry_if_parser_fails = true,
    parser,
    signal,
    fallbacks,
    access_token,
    ...config
  }: PromptwizConfig,
  promptRunner: ProviderPrompt
): Promise<PromptwizOutput<O>> {
  let retries = -1;
  let delay = 0;
  let cumulative_input_tokens = 0;
  let cumulative_output_tokens = 0;
  let cumulative_cost = 0;
  let run_error;

  let TOKEN = access_token;

  let current = {
    provider: config.provider,
    model: config.model,
    parameters: config.parameters || {},
    prompt: config.prompt,
  };
  let used_fallback = false;

  while (++retries <= max_retries) {
    try {
      if (signal?.aborted) throw new errors.AbortError();
      const { outputs, original, usage } = await promptRunner({
        ...config,
        ...current,
        access_token: TOKEN,
      });
      // Sum tokens here because they're truly spent once we reach this point even though we might fail to parse and end up rerunning again
      // We might fail due to parse errors cascading into others that exceed the max_retries limit.
      // Even in the cases where we fail entirely we will be charged by the provider for tokens used so we sum them across retries
      cumulative_input_tokens += usage.input_tokens;
      cumulative_output_tokens += usage.output_tokens;
      cumulative_cost += usage.cost;
      const results = {
        outputs: parser
          ? outputs.map((o) => {
              try {
                const content = parser(o.content);
                return { ...o, content, original: o.content };
              } catch (err) {
                throw new errors.ParserError(
                  err instanceof Error
                    ? err.message
                    : "Unexpected error parseing the model output"
                );
              }
            })
          : outputs,
        original,
        usage: {
          input_tokens: cumulative_input_tokens,
          output_tokens: cumulative_output_tokens,
          cost: cumulative_cost,
          retries,
        },
        used_fallback,
        ...current,
      };
      // @ts-expect-error - parsed outputs are not typed correctly yet
      return results;
    } catch (error) {
      // Aborting beats everything!
      if (error instanceof errors.AbortError || signal?.aborted) {
        throw new errors.AbortError();
      }

      // Next we try to handle any user-defined model fallbacks
      let strategy =
        // @ts-expect-error - Doesn't everything have a constructor???
        fallbacks?.[error?.contructor.name as keyof typeof fallbacks];
      if (strategy && strategy.after >= max_retries) {
        used_fallback = true;
        // get index of current model
        const c = strategy.models.findIndex(
          (m) => m.provider === current.provider && m.model === current.model
        );
        // grab the next model in the list, or stick to the last one if no more
        const _next =
          strategy.models[Math.min(c + 1, strategy.models.length - 1)];
        let parameters = _next.parameters;
        if (!parameters) {
          // if no fallback parameters defined then prefer to use existing params if the providers are the same
          // if the provider is different we'll convert the parameters found in the config
          parameters =
            _next.provider === config.provider
              ? config.parameters
              : _next.provider === current.provider
              ? current.parameters
              : config.parameters
              ? getProvider(_next.provider).parametersFromProvider(
                  config.provider,
                  config.parameters
                )
              : undefined;
        }
        const { access_token: token, ...next } = _next;
        TOKEN = token;
        current = {
          ...next,
          provider: next.provider,
          model: next.model,
          parameters: parameters || {},
          prompt: next.prompt || current.prompt,
        };
        continue;
      }

      // Otherwise it's our normal error handling logic
      if (retries < max_retries && error instanceof errors.RateLimitError) {
        // Retry the atomic step with exponential backoff
        delay = 2000 * 2 ** retries;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else if (
        retries < max_retries &&
        error instanceof errors.ParserError &&
        retry_if_parser_fails
      ) {
        continue;
      } else {
        run_error = error;
        break;
      }
    }
  }
  return {
    outputs: [],
    original: null,
    error: run_error as Error,
    usage: {
      input_tokens: cumulative_input_tokens,
      output_tokens: cumulative_output_tokens,
      cost: cumulative_cost,
      retries,
    },
    used_fallback,
    ...current,
  };
}
