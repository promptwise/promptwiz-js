const { cohere } = require("../build/cjs/core/providers/cohere");
const errors = require("../build/cjs/core/errors");

global.fetch = jest.fn(() => Promise.resolve());

beforeEach(() => {
  global.fetch.mockClear();
});

describe("Cohere provider", () => {
  describe("generate", () => {
    const defaultParams = {
      model: "command-light-nightly",
      access_token: "test-token",
      parameters: {},
      prompt: "Test prompt",
    };

    test("requires access_token", () => {
      expect(() =>
        cohere.generate({ ...defaultParams, access_token: undefined })
      ).toThrow(errors.AuthorizationError);
    });

    test("chat prompts", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            prompt: "Test",
            generations: [
              {
                id: "gen1",
                text: "Hello, how can I help you today?",
                index: 0,
              },
            ],
            meta: {},
          })
        )
      );

      const result = await cohere.generate({
        ...defaultParams,
        prompt: [{ role: "user", content: "Hello" }],
      });

      // Expecting the fetch to have been called with the converted chat message.
      expect(fetch).toHaveBeenCalledWith(
        "https://api.cohere.com/v1/generate",
        expect.objectContaining({
          body: expect.stringContaining("User: Hello\\n\\nAssistant:"),
        })
      );
      expect(result.generations[0].text).toBe(
        "Hello, how can I help you today?"
      );
    });

    test("text prompts", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            prompt: "Test",
            generations: [
              {
                id: "gen1",
                text: "Are you testing me? Testing... 1... 2... 3...",
                index: 0,
              },
            ],
            meta: {},
          })
        )
      );

      const result = await cohere.generate(defaultParams);

      // Expecting the fetch to have been called with the simple text prompt.
      expect(fetch).toHaveBeenCalledWith(
        "https://api.cohere.com/v1/generate",
        expect.objectContaining({
          body: expect.stringContaining("Test prompt"),
        })
      );
      expect(result.generations[0].text).toBe(
        "Are you testing me? Testing... 1... 2... 3..."
      );
    });

    test("handles response: 401 AuthorizationError", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "Unauthorized" } }), {
          status: 401,
        })
      );

      await expect(cohere.generate(defaultParams)).rejects.toThrow(
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

      await expect(cohere.generate(defaultParams)).rejects.toThrow(
        errors.RateLimitError
      );
    });

    test("handles response: 500 ServerError", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "Server Error" } }), {
          status: 500,
        })
      );

      await expect(cohere.generate(defaultParams)).rejects.toThrow(
        errors.ServerError
      );
    });

    test("handles response: Error", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "Generic Error" } }), {
          status: 418,
        })
      );

      await expect(cohere.generate(defaultParams)).rejects.toThrow(Error);
    });
  });
  describe("prompt", () => {
    const defaultConfig = {
      model: "command-light-nightly",
      access_token: "test-token",
      parameters: {},
      prompt: "Test prompt",
    };

    test("handles simple prompt", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            prompt: "Test",
            generations: [{ id: "gen1", text: "Generated Text", index: 0 }],
            meta: {},
          })
        )
      );

      const result = await cohere.prompt(defaultConfig);

      expect(result.outputs[0].content).toBe("Generated Text");
      expect(result.outputs[0].tokens).toBe(2);
    });

    test("handles multiple generations", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            prompt: "Test",
            generations: [
              { id: "gen1", text: "Generated Text 1", index: 0 },
              { id: "gen2", text: "Generated Text 2", index: 1 },
            ],
            meta: {},
          })
        )
      );

      const result = await cohere.prompt(defaultConfig);

      expect(result.outputs).toHaveLength(2);
      expect(result.outputs[0].content).toBe("Generated Text 1");
      expect(result.outputs[0].tokens).toBe(4);
      expect(result.outputs[1].content).toBe("Generated Text 2");
      expect(result.outputs[1].tokens).toBe(4);
    });

    test("detects truncation when max_tokens is reached and stop_sequences are not present", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            prompt: "Test",
            generations: [{ id: "gen1", text: "Generated Text", index: 0 }],
            meta: {},
          })
        )
      );

      const result = await cohere.prompt({
        ...defaultConfig,
        parameters: { max_tokens: 2 },
      });
      expect(result.outputs[0].truncated).toBe(true);
    });

    test("detects truncation when max_tokens is reached and stop_sequences don't end the text", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            prompt: "Test",
            generations: [{ id: "gen1", text: "Generated Text", index: 0 }],
            meta: {},
          })
        )
      );

      const result = await cohere.prompt({
        ...defaultConfig,
        parameters: { max_tokens: 2, stop_sequences: ["end"] },
      });

      expect(result.outputs[0].truncated).toBe(true);
    });

    test("does not detect truncation when max_tokens is not reached", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            prompt: "Test",
            generations: [{ id: "gen1", text: "Generated Text", index: 0 }],
            meta: {},
          })
        )
      );

      const result = await cohere.prompt({
        ...defaultConfig,
        parameters: { max_tokens: 10 },
      });

      expect(result.outputs[0].truncated).toBe(false);
    });

    test("does not detect truncation when text ends with a stop_sequence", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            prompt: "Test",
            generations: [{ id: "gen1", text: "Generated Text end", index: 0 }],
            meta: {},
          })
        )
      );

      const result = await cohere.prompt({
        ...defaultConfig,
        parameters: { max_tokens: 3, stop_sequences: ["end"] },
      });

      expect(result.outputs[0].truncated).toBe(false);
    });
  });
  describe("run", () => {
    test("run prompt without inputs", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "1",
            prompt: "Test",
            generations: [
              {
                id: "gen1",
                text: "Hello, little friend! How are you doing today?",
                index: 0,
              },
            ],
            meta: {},
          })
        )
      );
      const result = await cohere.run({
        provider: "normal",
        access_token: "foobar",
        model: "command",
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
            id: "1",
            prompt: "Test",
            generations: [
              {
                id: "gen1",
                text: "Hello, little friend! How are you doing today?",
                index: 0,
              },
            ],
            meta: {},
          })
        )
      );
      const result = await cohere.run({
        access_token: "foobar",
        model: "command",
        prompt: "Say hello to <my_name>!",
        inputs: { my_name: "my little friend" },
      });
      expect(fetch).toHaveBeenCalledWith(
        "https://api.cohere.com/v1/generate",
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
        await cohere.run({
          access_token: "foobar",
          model: "command",
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
            id: "1",
            prompt: "Test",
            generations: [
              {
                id: "gen1",
                text: '{"reply": "Hello, little friend! How are you doing today?" }',
                index: 0,
              },
            ],
            meta: {},
          })
        )
      );
      const parser = jest.fn(JSON.parse);
      const result = await cohere.run({
        access_token: "foobar",
        model: "command",
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
              id: "1",
              prompt: "Test",
              generations: [
                {
                  id: "gen1",
                  text: "Not valid json",
                  index: 0,
                },
              ],
              meta: {},
            })
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              id: "1",
              prompt: "Test",
              generations: [
                {
                  id: "gen1",
                  text: '{"reply": "Hello, little friend! How are you doing today?" }',
                  index: 0,
                },
              ],
              meta: {},
            })
          )
        );
      const parser = jest.fn(JSON.parse);
      const result = await cohere.run({
        access_token: "foobar",
        model: "command",
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
      expect(result.usage.output_tokens).toBe(19);
      expect(result.outputs[0].tokens).toBe(16);
      expect(result.usage.retries).toBe(1);
    });
  });
  describe("tokenizer", () => {
    test("encode", () => {
      const tokenizer = cohere.tokenizer("command");
      expect(tokenizer.encode("tokenize me! :D")).toMatchObject([
        10002, 2261, 2012, 8, 2792, 43,
      ]);
    });
    test("decode", () => {
      const tokenizer = cohere.tokenizer("command");
      expect(tokenizer.decode([10002, 2261, 2012, 8, 2792, 43])).toBe(
        "tokenize me! :D"
      );
    });
    test("decodeTokens", () => {
      const tokenizer = cohere.tokenizer("command");
      expect(
        tokenizer.decodeTokens([10002, 2261, 2012, 8, 2792, 43])
      ).toMatchObject(["token", "ize", " me", "!", " :", "D"]);
    });
    test("decodeToken", () => {
      const tokenizer = cohere.tokenizer("command");
      expect(tokenizer.decodeToken(10002)).toBe("token");
      expect(tokenizer.decodeToken(2012)).toBe(" me");
      expect(tokenizer.decodeToken(1878)).toBe("\n    ");
    });
    describe("count", () => {
      test("count tokens for string", () => {
        const tokenizer = cohere.tokenizer("command");
        expect(tokenizer.count("tokenize me! :D")).toBe(6);
      });
      test("count tokens for single chat message", () => {
        const tokenizer = cohere.tokenizer("command");
        expect(
          tokenizer.count({ role: "assistant", content: "tokenize me! :D" })
        ).toBe(11);
      });
      test("count tokens for chat messages prompt", () => {
        const tokenizer = cohere.tokenizer("command");
        expect(
          tokenizer.count([
            { role: "assistant", content: "tokenize me! :D" },
            { role: "user", content: "okay" },
          ])
        ).toBe(23);
      });
    });
  });
  describe("util methods", () => {
    test("maxTokensForModel", () => {
      expect(cohere.maxTokensForModel("command")).toBe(2048);
      expect(cohere.maxTokensForModel("command-light")).toBe(2048);
      expect(cohere.maxTokensForModel("command-light-nightly")).toBe(2048);
      expect(cohere.maxTokensForModel("command-light-nightly")).toBe(2048);
    });
    test("maxGenerationsPerPrompt", () => {
      expect(cohere.maxGenerationsPerPrompt()).toBe(5);
    });
    test("maxTemperature", () => {
      expect(cohere.maxTemperature()).toBe(5);
    });
    test("minTemperature", () => {
      expect(cohere.minTemperature()).toBe(0);
    });
    test("promptDollarCostForModel", () => {
      expect(cohere.promptDollarCostForModel("command", 0, 0)).toBe(0);
      expect(cohere.promptDollarCostForModel("command", 0, -10)).toBe(0);
      expect(cohere.promptDollarCostForModel("command", -10, 0)).toBe(0);
      expect(cohere.promptDollarCostForModel("command", -10, -10)).toBe(0);
      expect(cohere.promptDollarCostForModel("command", 0.5, 0.5)).toBeCloseTo(
        0.00003,
        6
      );
      expect(cohere.promptDollarCostForModel("command", 0, 100000)).toBeCloseTo(
        1.5,
        6
      );
      expect(cohere.promptDollarCostForModel("command", 100000, 0)).toBeCloseTo(
        1.5,
        6
      );
      expect(
        cohere.promptDollarCostForModel("command", 100000, 100000)
      ).toBeCloseTo(3, 6);
    });
  });
  describe("parametersFromProvider", () => {
    test("anthropic parameters", () => {
      const anthropicParams = {
        max_tokens_to_sample: 10,
        temperature: 0.7,
        top_k: 3,
        top_p: 0.9,
        stop_sequences: ["end"],
        stream: true,
      };

      const result = cohere.parametersFromProvider(
        "anthropic",
        anthropicParams
      );

      expect(result).toEqual({
        num_generations: 1,
        max_tokens: 10,
        temperature: 0.7 * 5,
        k: 3,
        p: 0.9,
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

      const result = cohere.parametersFromProvider("openai", openAIParams);

      expect(result).toEqual({
        num_generations: 3,
        max_tokens: 20,
        temperature: 0.6 * 2.5,
        k: 2,
        p: 0.8,
        frequency_penalty: (1 + 2) / 4,
        presence_penalty: (0.5 + 2) / 4,
        stop_sequences: ["stop"],
        stream: false,
      });
    });
  });
});
