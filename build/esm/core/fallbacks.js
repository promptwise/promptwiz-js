const fastest = {
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
    { provider: "openai", model: "gpt-3.5-turbo" },
    { provider: "openai", model: "gpt-3.5-turbo-0301" },
    { provider: "openai", model: "gpt-3.5-turbo-16k" },
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" },
    { provider: "openai", model: "gpt-4" },
    { provider: "openai", model: "gpt-4-0613" },
    { provider: "openai", model: "gpt-4-0314" },
    { provider: "openai", model: "gpt-4-32k" },
    { provider: "openai", model: "gpt-4-32k-0613" },
    { provider: "openai", model: "gpt-4-32k-0314" },
    { provider: "anthropic", model: "claude-1" },
    { provider: "anthropic", model: "claude-2" },
    { provider: "anthropic", model: "claude-2.0" }
  ]
};
const cheapest = {
  after_errors: 2,
  models: [
    { provider: "openai", model: "gpt-3.5-turbo-instruct" },
    { provider: "anthropic", model: "claude-instant-1" },
    { provider: "anthropic", model: "claude-instant-1.1" },
    { provider: "openai", model: "gpt-3.5-turbo-0301" },
    { provider: "openai", model: "gpt-3.5-turbo" },
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" },
    { provider: "anthropic", model: "claude-1" },
    { provider: "anthropic", model: "claude-2.0" },
    { provider: "anthropic", model: "claude-2" },
    { provider: "cohere", model: "command" },
    { provider: "cohere", model: "command-light" },
    { provider: "cohere", model: "command-nightly" },
    { provider: "cohere", model: "command-light-nightly" },
    { provider: "openai", model: "text-davinci-002" },
    { provider: "openai", model: "text-davinci-003" },
    { provider: "openai", model: "gpt-4-0613" },
    { provider: "openai", model: "gpt-4" },
    { provider: "openai", model: "gpt-4-0314" },
    { provider: "openai", model: "gpt-4-32k-0613" },
    { provider: "openai", model: "gpt-4-32k-0314" },
    { provider: "openai", model: "gpt-4-32k" }
  ]
};
const strongest = {
  after_errors: 3,
  models: [
    { provider: "openai", model: "gpt-4-32k" },
    { provider: "openai", model: "gpt-4-32k-0314" },
    { provider: "openai", model: "gpt-4-32k-0613" },
    { provider: "openai", model: "gpt-4" },
    { provider: "openai", model: "gpt-4-0613" },
    { provider: "openai", model: "gpt-4-0314" },
    { provider: "openai", model: "gpt-3.5-turbo" },
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" },
    { provider: "openai", model: "gpt-3.5-turbo-0301" },
    { provider: "openai", model: "text-davinci-003" },
    { provider: "openai", model: "text-davinci-002" },
    { provider: "anthropic", model: "claude-2" },
    { provider: "anthropic", model: "claude-2.0" },
    { provider: "anthropic", model: "claude-1" },
    { provider: "anthropic", model: "claude-instant-1" },
    { provider: "anthropic", model: "claude-instant-1.1" },
    { provider: "cohere", model: "command-nightly" },
    { provider: "cohere", model: "command" },
    { provider: "cohere", model: "command-light-nightly" },
    { provider: "cohere", model: "command-light" }
  ]
};
const largest = {
  after_errors: 3,
  models: [
    { provider: "cohere", model: "command-light" },
    { provider: "cohere", model: "command-light-nightly" },
    { provider: "cohere", model: "command" },
    { provider: "cohere", model: "command-nightly" },
    { provider: "anthropic", model: "claude-instant-1.1" },
    { provider: "anthropic", model: "claude-instant-1" },
    { provider: "anthropic", model: "claude-1" },
    { provider: "anthropic", model: "claude-2.0" },
    { provider: "anthropic", model: "claude-2" },
    { provider: "openai", model: "text-davinci-002" },
    { provider: "openai", model: "text-davinci-003" },
    { provider: "openai", model: "gpt-3.5-turbo-0301" },
    { provider: "openai", model: "gpt-3.5-turbo-16k-0613" },
    { provider: "openai", model: "gpt-3.5-turbo" },
    { provider: "openai", model: "gpt-4-0314" },
    { provider: "openai", model: "gpt-4-0613" },
    { provider: "openai", model: "gpt-4" },
    { provider: "openai", model: "gpt-4-32k-0613" },
    { provider: "openai", model: "gpt-4-32k-0314" },
    { provider: "openai", model: "gpt-4-32k" }
  ]
};
export {
  cheapest,
  fastest,
  largest,
  strongest
};
