const { openai } = require("../build/cjs/core/providers/openai");
const errors = require("../build/cjs/core/errors");

global.fetch = jest.fn(() => Promise.resolve());

beforeEach(() => {
  global.fetch.mockClear();
});

describe("OpenAI provider", () => {
  describe("generate", () => {
    const defaultParams = {
      model: "gpt-3.5-turbo",
      access_token: "test-token",
      parameters: {},
      prompt: "Test prompt",
    };

    test("requires access_token", () => {
      expect(() =>
        openai.generate({ ...defaultParams, access_token: undefined })
      ).toThrow(errors.AuthorizationError);
    });

    test("chat prompts to chat models", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  role: "assistant",
                  content: "Hello, how can I help you today?",
                },
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 20,
              completion_tokens: 10,
            },
          })
        )
      );

      const result = await openai.generate({
        ...defaultParams,
        prompt: [{ role: "user", content: "Hello" }],
      });

      // Expecting the fetch to have been called with the converted chat message.
      expect(fetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/chat/completions",
        expect.objectContaining({
          body: expect.stringContaining(
            `{\"model\":\"gpt-3.5-turbo\",\"stream\":false,\"messages\":[{\"role\":\"user\",\"content\":\"Hello\"}]}`
          ),
        })
      );
      expect(result.choices[0].message.content).toBe(
        "Hello, how can I help you today?"
      );
    });

    test("chat prompts to text models", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                text: "Hello, how can I help you today?",
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 20,
              completion_tokens: 10,
            },
          })
        )
      );

      const result = await openai.generate({
        ...defaultParams,
        model: "text-davinci-003",
        prompt: [{ role: "user", content: "Hello" }],
      });

      // Expecting the fetch to have been called with the converted chat message.
      expect(fetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/completions",
        expect.objectContaining({
          body: expect.stringContaining("User: Hello\\n\\nAssistant:"),
        })
      );
      expect(result.choices[0].text).toBe("Hello, how can I help you today?");
    });

    test("text prompts to text modela", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                text: "Are you testing me? Testing... 1... 2... 3...",
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 20,
              completion_tokens: 10,
            },
          })
        )
      );

      const result = await openai.generate({
        ...defaultParams,
        model: "text-davinci-003",
      });

      // Expecting the fetch to have been called with the simple text prompt.
      expect(fetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/completions",
        expect.objectContaining({
          body: expect.stringContaining("Test prompt"),
        })
      );
      expect(result.choices[0].text).toBe(
        "Are you testing me? Testing... 1... 2... 3..."
      );
    });

    test("text prompts to chat models", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  role: "assistant",
                  content: "Are you testing me? Testing... 1... 2... 3...",
                },
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 20,
              completion_tokens: 10,
            },
          })
        )
      );

      const result = await openai.generate(defaultParams);
      // Expecting the fetch to have been called with the simple text prompt.
      expect(fetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/chat/completions",
        expect.objectContaining({
          body: expect.stringContaining(
            `{\"model\":\"gpt-3.5-turbo\",\"stream\":false,\"messages\":[{\"role\":\"system\",\"content\":\"Test prompt\"}]}`
          ),
        })
      );
      expect(result.choices[0].message.content).toBe(
        "Are you testing me? Testing... 1... 2... 3..."
      );
    });

    test("handles response: 401 AuthorizationError", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "Unauthorized" } }), {
          status: 401,
        })
      );

      await expect(openai.generate(defaultParams)).rejects.toThrow(
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

      await expect(openai.generate(defaultParams)).rejects.toThrow(
        errors.RateLimitError
      );
    });

    test("handles response: 429 ServiceQuotaError", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: { message: "You've reached your quota for this month." },
          }),
          {
            status: 429,
            statusText: "You've reached your quota for this month.",
          }
        )
      );

      await expect(openai.generate(defaultParams)).rejects.toThrow(
        errors.ServiceQuotaError
      );
    });

    test("handles response: 500 ServerError", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "Server Error" } }), {
          status: 500,
        })
      );

      await expect(openai.generate(defaultParams)).rejects.toThrow(
        errors.ServerError
      );
    });

    test("handles response: Error", async () => {
      global.fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "Generic Error" } }), {
          status: 418,
        })
      );

      await expect(openai.generate(defaultParams)).rejects.toThrow(Error);
    });
  });
  describe("prompt", () => {
    const defaultConfig = {
      model: "gpt-3.5-turbo",
      access_token: "test-token",
      parameters: {},
      prompt: "Test prompt",
    };

    test("handles simple prompt", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  role: "assistant",
                  content: "Generated Text",
                },
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 2,
              completion_tokens: 2,
            },
          })
        )
      );

      const result = await openai.prompt(defaultConfig);

      expect(result.outputs[0].content).toBe("Generated Text");
      expect(result.outputs[0].tokens).toBe(2);
    });

    test("handles multiple generations", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  role: "assistant",
                  content: "Generated Text 1",
                },
                finish_reason: null,
              },
              {
                message: {
                  role: "assistant",
                  content: "Generated Text 2",
                },
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 2,
              completion_tokens: 8,
            },
          })
        )
      );

      const result = await openai.prompt(defaultConfig);

      expect(result.outputs).toHaveLength(2);
      expect(result.outputs[0].content).toBe("Generated Text 1");
      expect(result.outputs[0].tokens).toBe(4);
      expect(result.outputs[1].content).toBe("Generated Text 2");
      expect(result.outputs[1].tokens).toBe(4);
    });

    test("detects truncation when max_tokens is reached", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  role: "assistant",
                  content: "Generated Text",
                },
                finish_reason: "length",
              },
            ],
            usage: {
              prompt_tokens: 2,
              completion_tokens: 2,
            },
          })
        )
      );

      const result = await openai.prompt({
        ...defaultConfig,
        parameters: { max_tokens: 2 },
      });
      expect(result.outputs[0].truncated).toBe(true);
    });

    test("does not detect truncation when max_tokens is not reached", async () => {
      fetch.mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  role: "assistant",
                  content: "Generated Text",
                },
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 2,
              completion_tokens: 2,
            },
          })
        )
      );

      const result = await openai.prompt({
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
            choices: [
              {
                message: {
                  role: "assistant",
                  content: "Hello, little friend! How are you doing today?",
                },
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 2,
              completion_tokens: 2,
            },
          })
        )
      );
      const result = await openai.run({
        access_token: "foobar",
        model: "gpt-3.5-turbo",
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
            choices: [
              {
                message: {
                  role: "assistant",
                  content: "Hello, little friend! How are you doing today?",
                },
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 2,
              completion_tokens: 2,
            },
          })
        )
      );
      const result = await openai.run({
        access_token: "foobar",
        model: "gpt-3.5-turbo",
        prompt: [{ role: "user", content: "Say hello to <my_name>!" }],
        inputs: { my_name: "my little friend" },
      });
      expect(fetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/chat/completions",
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
        await openai.run({
          access_token: "foobar",
          model: "gpt-3.5-turbo",
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
            choices: [
              {
                message: {
                  role: "assistant",
                  content:
                    '{"reply": "Hello, little friend! How are you doing today?" }',
                },
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 2,
              completion_tokens: 2,
            },
          })
        )
      );
      const parser = jest.fn(JSON.parse);
      const result = await openai.run({
        access_token: "foobar",
        model: "gpt-3.5-turbo",
        parser,
        prompt: "Say hello to my little friend!",
      });

      expect(parser).toHaveBeenCalledTimes(1);
      expect(result.outputs[0].content).toMatchObject({
        reply: "Hello, little friend! How are you doing today?",
      });
      expect(result.outputs[0].original).toBe(
        '{"reply": "Hello, little friend! How are you doing today?" }'
      );
    });

    test("will retry if parser throws error and records cumaltive tokens used across N outputs", async () => {
      global.fetch
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              choices: [
                {
                  message: {
                    role: "assistant",
                    content: "Not valid json.",
                  },
                  finish_reason: null,
                },
              ],
              usage: {
                prompt_tokens: 2,
                completion_tokens: 4,
              },
            })
          )
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              choices: [
                {
                  message: {
                    role: "assistant",
                    content:
                      '{"reply": "Hello, little friend! How are you doing today?" }',
                  },
                  finish_reason: null,
                },
              ],
              usage: {
                prompt_tokens: 2,
                completion_tokens: 11,
              },
            })
          )
        );
      const parser = jest.fn(JSON.parse);
      const result = await openai.run({
        access_token: "foobar",
        model: "gpt-3.5-turbo",
        max_retries: 1,
        parser,
        prompt: "Say hello to my little friend!",
      });

      expect(parser).toHaveBeenCalledTimes(2);
      expect(result.outputs[0].content).toMatchObject({
        reply: "Hello, little friend! How are you doing today?",
      });
      expect(result.outputs[0].original).toBe(
        '{"reply": "Hello, little friend! How are you doing today?" }'
      );
      // Totals across all successful runs (because we'll be billed regardless of whether or not our downstream processes like the output)
      expect(result.usage.input_tokens).toBe(4);
      expect(result.usage.output_tokens).toBe(15);
      expect(result.outputs[0].tokens).toBe(11);
      expect(result.usage.retries).toBe(1);
    });
  });
  test.skip("stream", async () => {
    const testKey = ""; // TODO: Bring your own key and comment out the fetch mocking above
    // Start streaming response.
    const streamHandler = jest.fn((...args) =>
      console.log("Received:", ...args)
    );
    const result = openai.generate({
      access_token: testKey,
      model: "gpt-3.5-turbo",
      prompt: [{ role: "user", content: "Say hello to my little friend!" }],
      parameters: {
        temperature: 0.7,
        max_tokens: 200,
      },
      stream: streamHandler,
    });
    console.log({ result: await result });
  }, 20000);
  describe("tokenizer", () => {
    test("encode", () => {
      const tokenizer = openai.tokenizer("gpt-3.5-turbo");
      expect(tokenizer.encode("tokenize me! :D")).toMatchObject([
        5963, 553, 757, 0, 551, 35,
      ]);
    });
    test("decode", () => {
      const tokenizer = openai.tokenizer("gpt-3.5-turbo");
      expect(tokenizer.decode([5963, 553, 757, 0, 551, 35])).toBe(
        "tokenize me! :D"
      );
    });
    test("decodeTokens", () => {
      const tokenizer = openai.tokenizer("gpt-3.5-turbo");
      expect(
        tokenizer.decodeTokens([5963, 553, 757, 0, 551, 35])
      ).toMatchObject(["token", "ize", " me", "!", " :", "D"]);
    });
    test("decodeToken", () => {
      const tokenizer = openai.tokenizer("gpt-3.5-turbo");
      expect(tokenizer.decodeToken(5963)).toBe("token");
      expect(tokenizer.decodeToken(757)).toBe(" me");
    });
    describe("count", () => {
      test("count tokens for string", () => {
        const tokenizer = openai.tokenizer("gpt-3.5-turbo");
        expect(tokenizer.count("tokenize me! :D")).toBe(6);
      });
      test("count tokens for single chat message", () => {
        const tokenizer = openai.tokenizer("gpt-3.5-turbo");
        expect(
          tokenizer.count({ role: "assistant", content: "tokenize me! :D" })
        ).toBe(11);
      });
      test("count tokens for chat messages prompt", () => {
        const tokenizer = openai.tokenizer("gpt-3.5-turbo");
        expect(
          tokenizer.count([
            { role: "assistant", content: "tokenize me! :D" },
            { role: "user", content: "okay" },
          ])
        ).toBe(20);
      });
    });
  });
  describe("util methods", () => {
    test("maxTokensForModel", () => {
      expect(openai.maxTokensForModel("gpt-3.5-turbo")).toBe(4096);
      expect(openai.maxTokensForModel("text-embedding-ada-002")).toBe(2049);
      expect(openai.maxTokensForModel("gpt-4-32k")).toBe(32768);
    });
    test("maxGenerationsPerPrompt", () => {
      expect(openai.maxGenerationsPerPrompt()).toBe(16);
    });
    test("maxTemperature", () => {
      expect(openai.maxTemperature()).toBe(2);
    });
    test("minTemperature", () => {
      expect(openai.minTemperature()).toBe(0);
    });
    test("promptDollarCostForModel", () => {
      expect(openai.promptDollarCostForModel("gpt-3.5-turbo", 0, 0)).toBe(0);
      expect(openai.promptDollarCostForModel("gpt-3.5-turbo", 0, -10)).toBe(0);
      expect(openai.promptDollarCostForModel("gpt-3.5-turbo", -10, 0)).toBe(0);
      expect(openai.promptDollarCostForModel("gpt-3.5-turbo", -10, -10)).toBe(
        0
      );
      expect(
        openai.promptDollarCostForModel("gpt-3.5-turbo", 0.5, 0.5)
      ).toBeCloseTo(0.000003, 6);
      expect(
        openai.promptDollarCostForModel("gpt-3.5-turbo", 0, 100000)
      ).toBeCloseTo(0.2, 6);
      expect(
        openai.promptDollarCostForModel("gpt-3.5-turbo", 100000, 0)
      ).toBeCloseTo(0.1, 6);
      expect(
        openai.promptDollarCostForModel("gpt-3.5-turbo", 100000, 100000)
      ).toBeCloseTo(0.3, 6);
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

      const result = openai.parametersFromProvider(
        "anthropic",
        anthropicParams
      );

      expect(result).toEqual({
        n: 1,
        max_tokens: 10,
        temperature: 0.35,
        top_k: 3,
        top_p: 0.9,
        stop: ["end"],
        stream: true,
      });
    });

    test("cohere parameters", () => {
      const cohereParams = {
        num_generations: 3,
        max_tokens: 10,
        temperature: 5,
        k: 3,
        p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        end_sequences: ["end"],
        stop_sequences: ["end"],
        stream: true,
      };

      const result = openai.parametersFromProvider("cohere", cohereParams);

      expect(result).toEqual({
        n: 3,
        max_tokens: 10,
        temperature: 2,
        top_k: 3,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["end"],
        stream: true,
      });
    });
  });
});
