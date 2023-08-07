const getProviderModule = require("../build/cjs/core/getProvider");
const { promptwiz } = require("../build/cjs/core/promptwiz");
const {
  runPrompt: _runPrompt,
} = require("../build/cjs/core/providers/runPrompt");
const { RateLimitError, ParserError } = require("../build/cjs/core/errors");

jest.mock("../build/cjs/core/getProvider");

const mockRun = jest.fn(() => Promise.resolve("output"));

beforeAll(() => {
  // NOTE: Using provider names as a way to get different mock behavior from a provider
  getProviderModule.getProvider.mockImplementation((name) => ({
    run: mockRun,
  }));
});

beforeEach(() => {
  mockRun.mockClear();
});

describe("promptwiz", () => {
  test("is_running", async () => {
    const instance = promptwiz({
      provider: "normal",
      access_token: "foobar",
      model: "model",
      prompt: "Say hello to my little friend!",
    });
    expect(instance.is_running).toBe(false);
    const promise = instance.run();
    expect(instance.is_running).toBe(true);
    await promise;
    expect(instance.is_running).toBe(false);
  });
  describe("run", () => {
    test("throw error if already running", () => {
      const instance = promptwiz({
        provider: "normal",
        access_token: "foobar",
        model: "model",
        prompt: "Say hello to my little friend!",
      });
      instance.run();
      expect(instance.run()).rejects.toThrow(
        "Cannot run while another prompt is already running."
      );
    });

    test("sets and unsets is_running", async () => {
      const instance = promptwiz({
        provider: "normal",
        access_token: "foobar",
        model: "model",
        prompt: "Say hello to <my_name>!",
      });

      expect(instance.is_running).toBe(false);
      const promise = instance.run();
      expect(instance.is_running).toBe(true);
      await promise;
      expect(instance.is_running).toBe(false);
    });

    test("calls getProvider and provider.run with correct args", async () => {
      const inputs = { my_name: "input value" };
      const instance = promptwiz({
        provider: "normal",
        access_token: "foobar",
        model: "model",
        prompt: "Say hello to <my_name>!",
      });

      await instance.run(inputs);
      expect(getProviderModule.getProvider).toHaveBeenCalledWith("normal");
      expect(mockRun).toHaveBeenCalledWith({
        provider: "normal",
        access_token: "foobar",
        model: "model",
        prompt: "Say hello to <my_name>!",
        inputs,
      });
    });
  });

  test("config", async () => {
    const instance = promptwiz({
      provider: "normal",
      access_token: "foobar",
      model: "model",
      prompt: "Say hello to <my_name>!",
    });

    instance.config({
      provider: "normal",
      access_token: "foobar2",
      model: "modelo",
    });

    instance.config({
      prompt: "Say hello to someone very special to me, Mr. Frog.",
    });

    await instance.run({ my_name: "my little friend" });
    expect(mockRun).toHaveBeenLastCalledWith({
      provider: "normal",
      access_token: "foobar2",
      model: "modelo",
      prompt: "Say hello to someone very special to me, Mr. Frog.",
      inputs: { my_name: "my little friend" },
    });
  });
});
