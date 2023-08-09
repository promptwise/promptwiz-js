// Fallback strategy that prefers the fastest output
export const fastest = {
  after_errors: 1,
  models: [
    { provider: "cohere", model: "command-light" },
    { provider: "cohere", model: "command-light-nightly" },
    { provider: "cohere", model: "command" },
    { provider: "cohere", model: "command-nightly" },
    { provider: "anthropic", model: "claude-instant-1" },
    { provider: "anthropic", model: "claude-instant-1.1" },
    { provider: "openai", model: "text-davinci-002" },
    { provider: "openai", model: "text-davinci-003" },
    { provider: "openai", model: "gpt-3.5-turbo" }, // Turbo versions are next, starting with the smaller token windows
    { provider: "openai", model: "gpt-3.5-turbo-0301" },
    { provider: "openai", model: "gpt-3.5-turbo-16k" },
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" },
    { provider: "openai", model: "gpt-4" }, // As we approach the larger token windows, we begin to move to the larger GPT versions
    { provider: "openai", model: "gpt-4-0613" },
    { provider: "openai", model: "gpt-4-0314" },
    { provider: "openai", model: "gpt-4-32k" },
    { provider: "openai", model: "gpt-4-32k-0613" },
    { provider: "openai", model: "gpt-4-32k-0314" },
    { provider: "anthropic", model: "claude-1" }, // Given the large token window size, the Anthropic models are placed towards the end
    { provider: "anthropic", model: "claude-2" },
    { provider: "anthropic", model: "claude-2.0" },
  ],
};

// Fallback strategy that prefers the cheapest output
export const cheapest = {
  after_errors: 2,
  models: [
    { provider: "openai", model: "gpt-3.5-turbo-instruct" }, // 0.0
    { provider: "anthropic", model: "claude-instant-1" }, // 0.163
    { provider: "anthropic", model: "claude-instant-1.1" }, // 0.163
    { provider: "openai", model: "gpt-3.5-turbo-0301" }, // 0.2
    { provider: "openai", model: "gpt-3.5-turbo" }, // 0.2
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" }, // 0.3
    { provider: "anthropic", model: "claude-1" }, // 1.102
    { provider: "anthropic", model: "claude-2.0" }, // 1.102
    { provider: "anthropic", model: "claude-2" }, // 1.102
    { provider: "cohere", model: "command" }, // 1.5
    { provider: "cohere", model: "command-light" }, // 1.5
    { provider: "cohere", model: "command-nightly" }, // 1.5
    { provider: "cohere", model: "command-light-nightly" }, // 1.5
    { provider: "openai", model: "text-davinci-002" }, // 2
    { provider: "openai", model: "text-davinci-003" }, // 2
    { provider: "openai", model: "gpt-4-0613" }, // 3
    { provider: "openai", model: "gpt-4" }, // 3
    { provider: "openai", model: "gpt-4-0314" }, // 3
    { provider: "openai", model: "gpt-4-32k-0613" }, // 6
    { provider: "openai", model: "gpt-4-32k-0314" }, // 6
    { provider: "openai", model: "gpt-4-32k" }, // 6
  ],
};

// Fallback strategy that prefers the strongest output
export const strongest = {
  after_errors: 3,
  models: [
    { provider: "openai", model: "gpt-4-32k" }, // 32768
    { provider: "openai", model: "gpt-4-32k-0314" }, // 32768
    { provider: "openai", model: "gpt-4-32k-0613" }, // 32768
    { provider: "openai", model: "gpt-4" }, // 8192
    { provider: "openai", model: "gpt-4-0613" }, // 8192
    { provider: "openai", model: "gpt-4-0314" }, // 8192
    { provider: "openai", model: "gpt-3.5-turbo" }, // 4096
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" }, // 16384
    { provider: "openai", model: "gpt-3.5-turbo-0301" }, // 4096
    { provider: "openai", model: "text-davinci-003" }, // 4097
    { provider: "openai", model: "text-davinci-002" }, // 4097
    { provider: "anthropic", model: "claude-2" }, // 100,000
    { provider: "anthropic", model: "claude-2.0" }, // 100,000
    { provider: "anthropic", model: "claude-1" }, // 100,000 (Note: token_window isn't always an indicator of model's "strength")
    { provider: "anthropic", model: "claude-instant-1" }, // 100,000
    { provider: "anthropic", model: "claude-instant-1.1" }, // 100,000
    { provider: "cohere", model: "command-nightly" }, // 2048
    { provider: "cohere", model: "command" }, // 2048
    { provider: "cohere", model: "command-light-nightly" }, // 2048
    { provider: "cohere", model: "command-light" }, // 2048
  ],
};

// Fallback strategy that prefers the largest model that can meet the output requirements
export const largest = {
  after_errors: 3,
  models: [
    { provider: "cohere", model: "command-light" }, // 2048
    { provider: "cohere", model: "command-light-nightly" }, // 2048
    { provider: "cohere", model: "command" }, // 2048
    { provider: "cohere", model: "command-nightly" }, // 2048
    { provider: "anthropic", model: "claude-instant-1.1" }, // 100,000
    { provider: "anthropic", model: "claude-instant-1" }, // 100,000
    { provider: "anthropic", model: "claude-1" }, // 100,000 (Note: token_window isn't always an indicator of model's "strength")
    { provider: "anthropic", model: "claude-2.0" }, // 100,000
    { provider: "anthropic", model: "claude-2" }, // 100,000
    { provider: "openai", model: "text-davinci-002" }, // 4097
    { provider: "openai", model: "text-davinci-003" }, // 4097
    { provider: "openai", model: "gpt-3.5-turbo-0301" }, // 4096
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" }, // 16384
    { provider: "openai", model: "gpt-3.5-turbo" }, // 4096
    { provider: "openai", model: "gpt-4-0314" }, // 8192
    { provider: "openai", model: "gpt-4-0613" }, // 8192
    { provider: "openai", model: "gpt-4" }, // 8192
    { provider: "openai", model: "gpt-4-32k-0613" }, // 32768
    { provider: "openai", model: "gpt-4-32k-0314" }, // 32768
    { provider: "openai", model: "gpt-4-32k" }, // 32768
  ],
};
