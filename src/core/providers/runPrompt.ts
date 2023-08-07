import { PromptwizControllerConfig, PromptwizOutput } from "../types";
import * as errors from "../errors";

export async function runPrompt<O = string>(
  {
    max_retries = 3,
    retry_if_parser_fails = true,
    parser,
    signal,
  }: PromptwizControllerConfig<O>,
  runner: () => Promise<PromptwizOutput<string>>
): Promise<PromptwizOutput<O>> {
  let retries = -1;
  let delay = 0;
  let cumulative_input_tokens = 0;
  let cumulative_output_tokens = 0;
  let cumulative_cost = 0;
  let run_error;

  while (++retries <= max_retries) {
    try {
      if (signal?.aborted) throw new errors.AbortError();
      const { outputs, original, usage } = await runner();
      cumulative_input_tokens += usage.input_tokens;
      cumulative_output_tokens += usage.output_tokens;
      cumulative_cost += usage.cost;
      const results = {
        outputs: parser
          ? outputs.map((o) => {
              try {
                const content = parser(o.content);
                return { ...o, content };
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
      };
      // @ts-expect-error - parsed outputs are not typed correctly yet
      return results;
    } catch (error) {
      if (error instanceof errors.AbortError || signal?.aborted) {
        throw new errors.AbortError();
      }
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
  };
}
