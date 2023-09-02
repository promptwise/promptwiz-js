const { anthropic } = require("../build/cjs/core/providers/anthropic");
const errors = require("../build/cjs/core/errors");

global.fetch = jest.fn(() => Promise.resolve());

beforeEach(() => {
  global.fetch.mockClear();
});

describe("Anthropic provider", () => {
  describe("generate", () => {
    const defaultParams = {
      model: "claude-instant-1",
      access_token: "test-token",
      parameters: {},
      prompt: "Test prompt",
    };

    test("requires access_token", () => {
      expect(() =>
        anthropic.generate({ ...defaultParams, access_token: undefined })
      ).toThrow(errors.AuthorizationError);
    });

    test("chat prompts", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "claude-instant-1",
            completion: "Hello, how can I help you today?",
            stop_reason: null,
          })
        )
      );

      const result = await anthropic.generate({
        ...defaultParams,
        prompt: [{ role: "user", content: "Hello" }],
      });

      // Expecting the fetch to have been called with the converted chat message.
      expect(fetch).toHaveBeenCalledWith(
        "https://api.anthropic.com/v1/complete",
        expect.objectContaining({
          body: expect.stringContaining("\\n\\nHuman: Hello\\n\\nAssistant:"),
        })
      );
      expect(result.completion).toBe("Hello, how can I help you today?");
    });

    test("text prompts", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "claude-instant-1",
            completion: "Are you testing me? Testing... 1... 2... 3...",
            stop_reason: null,
          })
        )
      );

      const result = await anthropic.generate(defaultParams);

      // Expecting the fetch to have been called with the simple text prompt.
      expect(fetch).toHaveBeenCalledWith(
        "https://api.anthropic.com/v1/complete",
        expect.objectContaining({
          body: expect.stringContaining(
            "\\n\\nHuman: Test prompt\\n\\nAssistant:"
          ),
        })
      );
      expect(result.completion).toBe(
        "Are you testing me? Testing... 1... 2... 3..."
      );
    });

    test("handles response: 401 AuthorizationError", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "Unauthorized" } }), {
          status: 401,
        })
      );

      await expect(anthropic.generate(defaultParams)).rejects.toThrow(
        errors.AuthorizationError
      );
    });

    test("handles response: 429 RateLimitError", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({ error: { message: "Too Many Requests" } }),
          { status: 429 }
        )
      );

      await expect(anthropic.generate(defaultParams)).rejects.toThrow(
        errors.RateLimitError
      );
    });

    test("handles response: 500 ServerError", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "Server Error" } }), {
          status: 500,
        })
      );

      await expect(anthropic.generate(defaultParams)).rejects.toThrow(
        errors.ServerError
      );
    });

    test("handles response: 529 AvailabilityError", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({ error: { message: "Service Overloaded" } }),
          {
            status: 529,
          }
        )
      );

      await expect(anthropic.generate(defaultParams)).rejects.toThrow(
        errors.AvailabilityError
      );
    });

    test("handles response: Error", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "Generic Error" } }), {
          status: 418,
        })
      );

      await expect(anthropic.generate(defaultParams)).rejects.toThrow(Error);
    });
  });
  describe("prompt", () => {
    const defaultConfig = {
      model: "claude-instant-1",
      access_token: "test-token",
      parameters: {},
      prompt: "Test prompt",
    };

    test("handles simple prompt", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "claude-instant-1",
            completion: "Generated Text",
            stop_reason: null,
          })
        )
      );

      const result = await anthropic.prompt(defaultConfig);

      expect(result.outputs[0].content).toBe("Generated Text");
      expect(result.outputs[0].tokens).toBe(2);
    });

    test("detects truncation when max_tokens is reached", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "claude-instant-1",
            completion: "Generated Text",
            stop_reason: "max_tokens",
          })
        )
      );

      const result = await anthropic.prompt({
        ...defaultConfig,
        parameters: { max_tokens: 2 },
      });

      expect(result.outputs[0].truncated).toBe(true);
    });

    test("does not detect truncation when max_tokens is not reached", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "claude-instant-1",
            completion: "Generated Text",
            stop_reason: null,
          })
        )
      );

      const result = await anthropic.prompt({
        ...defaultConfig,
        parameters: { max_tokens: 10 },
      });

      expect(result.outputs[0].truncated).toBe(false);
    });
  });
  describe("run", () => {
    test("run prompt without inputs", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "claude-instant-1",
            completion: "Hello, little friend! How are you doing today?",
            stop_reason: null,
          })
        )
      );
      const result = await anthropic.run({
        provider: "normal",
        access_token: "foobar",
        model: "claude-instant-1",
        prompt: "Say hello to my little friend!",
      });
      expect(result.outputs[0].content).toBe(
        "Hello, little friend! How are you doing today?"
      );
      expect(result.usage.retries).toBe(0);
    });

    test("run prompt with inputs", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "claude-instant-1",
            completion: "Hello, little friend! How are you doing today?",
            stop_reason: null,
          })
        )
      );
      const result = await anthropic.run({
        access_token: "foobar",
        model: "claude-instant-1",
        prompt: "Say hello to <my_name>!",
        inputs: { my_name: "my little friend" },
      });
      expect(fetch).toHaveBeenCalledWith(
        "https://api.anthropic.com/v1/complete",
        expect.objectContaining({
          body: expect.stringContaining("Say hello to my little friend!"),
        })
      );
      expect(result.outputs[0].content).toBe(
        "Hello, little friend! How are you doing today?"
      );
      expect(result.usage.retries).toBe(0);
    });

    test.skip("uses exponential backoff before retrying when being throttled", async () => {
      global.fetch
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ error: { message: "Too Many Requests" } }),
            { status: 429 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ error: { message: "Too Many Requests" } }),
            { status: 429 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ error: { message: "Too Many Requests" } }),
            { status: 429 }
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ error: { message: "Too Many Requests" } }),
            { status: 429 }
          )
        );
      const start = Date.now();
      try {
        await anthropic.run({
          access_token: "foobar",
          model: "claude-instant-1",
          prompt: "Say hello to my little friend!",
        });
      } catch (err) {
        expect(err).toBeInstanceOf(errors.RateLimitError);
      }
      expect(global.fetch).toHaveBeenCalledTimes(4);
      // expect that it's taken over 14 seconds in total to run due to exponential backoff (2 sec + 4 sec + 8 sec)
      expect(Date.now() - start).toBeGreaterThan(14_000);
    }, 14100);

    test("can parse content", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            model: "claude-instant-1",
            completion:
              '{"reply": "Hello, little friend! How are you doing today?" }',
            stop_reason: null,
          })
        )
      );
      const parser = jest.fn(JSON.parse);
      const result = await anthropic.run({
        access_token: "foobar",
        model: "claude-instant-1",
        parser,
        prompt: "Say hello to my little friend!",
      });

      expect(parser).toHaveBeenCalledTimes(1);
      expect(result.outputs[0].content).toMatchObject({
        reply: "Hello, little friend! How are you doing today?",
      });
    });

    test("will retry if parser throws error and records cumaltive tokens used across N outputs", async () => {
      global.fetch
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              model: "claude-instant-1",
              completion: "Not valid json.",
              stop_reason: null,
            })
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              model: "claude-instant-1",
              completion:
                '{"reply": "Hello, little friend! How are you doing today?" }',
              stop_reason: null,
            })
          )
        );
      const parser = jest.fn(JSON.parse);
      const result = await anthropic.run({
        access_token: "foobar",
        model: "claude-instant-1",
        max_retries: 1,
        parser,
        prompt: "Say hello to my little friend!",
      });

      expect(parser).toHaveBeenCalledTimes(2);
      expect(result.outputs[0].content).toMatchObject({
        reply: "Hello, little friend! How are you doing today?",
      });
      // Totals across all successful runs (because we'll be billed regardless of whether or not our downstream processes like the output)
      expect(result.usage.input_tokens).toBe(14);
      expect(result.usage.output_tokens).toBe(20);
      expect(result.outputs[0].tokens).toBe(16);
      expect(result.usage.retries).toBe(1);
    });
  });
  describe("tokenizer", () => {
    test("encode", () => {
      const tokenizer = anthropic.tokenizer("claude-instant-1");
      expect(tokenizer.encode("tokenize me! :D")).toMatchObject([
        20639, 494, 5, 597, 40,
      ]);
    });
    test("decode", () => {
      const tokenizer = anthropic.tokenizer("claude-instant-1");
      expect(tokenizer.decode([20639, 494, 5, 597, 40])).toBe(
        "tokenize me! :D"
      );
    });
    test("decodeTokens", () => {
      const tokenizer = anthropic.tokenizer("claude-instant-1");
      expect(
        tokenizer.decodeTokens([20639, 494, 5, 597, 40])
      ).toMatchObject(["tokenize", " me", "!", " :", "D"]);
    });
    test("decodeToken", () => {
      const tokenizer = anthropic.tokenizer("claude-instant-1");
      expect(tokenizer.decodeToken(20639)).toBe("tokenize");
      expect(tokenizer.decodeToken(5)).toBe("!");
    });
    describe("count", () => {
      test("count tokens for string", () => {
        const tokenizer = anthropic.tokenizer("claude-instant-1");
        expect(tokenizer.count("tokenize me! :D")).toBe(5);
      });
      test("count tokens for single chat message", () => {
        const tokenizer = anthropic.tokenizer("claude-instant-1");
        expect(
          tokenizer.count({ role: "assistant", content: "tokenize me! :D" })
        ).toBe(8);
      });
      test("count tokens for chat messages prompt", () => {
        const tokenizer = anthropic.tokenizer("claude-instant-1");
        expect(
          tokenizer.count([
            { role: "assistant", content: "tokenize me! :D" },
            { role: "user", content: "okay" },
          ])
        ).toBe(15);
      });
    });
  });
  describe("util methods", () => {
    test("maxTokensForModel", () => {
      expect(anthropic.maxTokensForModel("claude-1")).toBe(100_000);
      expect(anthropic.maxTokensForModel("claude-instant-1.1")).toBe(100_000);
      expect(anthropic.maxTokensForModel("claude-2.0")).toBe(100_000);
      expect(anthropic.maxTokensForModel("claude-instant-1")).toBe(100_000);
      expect(anthropic.maxTokensForModel("claude-2")).toBe(100_000);
    });
    test("maxGenerationsPerPrompt", () => {
      expect(anthropic.maxGenerationsPerPrompt()).toBe(1);
    });
    test("maxTemperature", () => {
      expect(anthropic.maxTemperature()).toBe(1);
    });
    test("minTemperature", () => {
      expect(anthropic.minTemperature()).toBe(0);
    });
    test("promptDollarCostForModel", () => {
      expect(anthropic.promptDollarCostForModel("claude-instant-1", 0, 0)).toBe(
        0
      );
      expect(
        anthropic.promptDollarCostForModel("claude-instant-1", 0, -10)
      ).toBe(0);
      expect(
        anthropic.promptDollarCostForModel("claude-instant-1", -10, 0)
      ).toBe(0);
      expect(
        anthropic.promptDollarCostForModel("claude-instant-1", -10, -10)
      ).toBe(0);
      expect(
        anthropic.promptDollarCostForModel("claude-instant-1", 0.5, 0.5)
      ).toBeCloseTo(0.00000714, 6);
      expect(
        anthropic.promptDollarCostForModel("claude-instant-1", 0, 100000)
      ).toBeCloseTo(0.551, 6);
      expect(
        anthropic.promptDollarCostForModel("claude-instant-1", 100000, 0)
      ).toBeCloseTo(0.163, 6);
      expect(
        anthropic.promptDollarCostForModel("claude-instant-1", 100000, 100000)
      ).toBeCloseTo(0.714, 6);
    });
  });
  describe("parametersFromProvider", () => {
    test("cohere parameters", () => {
      const cohereParams = {
        num_generations: 5,
        max_tokens: 10,
        temperature: 0.7 * 5,
        k: 3,
        p: 0.9,
        end_sequences: ["end"],
        stop_sequences: ["end"],
        stream: true,
      };

      const result = anthropic.parametersFromProvider(
        "cohere",
        cohereParams
      );

      expect(result).toEqual({
        max_tokens_to_sample: 10,
        temperature: 0.7,
        top_k: 3,
        top_p: 0.9,
        stop_sequences: ["end"],
        stream: true,
      });
    });

    test("openai parameters", () => {
      const openAIParams = {
        n: 3,
        max_tokens: 20,
        temperature: 0.6,
        top_k: 2,
        top_p: 0.8,
        frequency_penalty: 1,
        presence_penalty: 0.5,
        stop: ["stop"],
        stream: false,
      };

      const result = anthropic.parametersFromProvider("openai", openAIParams);

      expect(result).toEqual({
        max_tokens_to_sample: 20,
        temperature: 0.6 / 2,
        top_k: 2,
        top_p: 0.8,
        stop_sequences: ["stop"],
        stream: false,
      });
    });
  });
});
