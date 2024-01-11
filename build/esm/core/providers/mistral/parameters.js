function parameters(params) {
  return params;
}
function maxGenerationsPerPrompt() {
  return 16;
}
function maxTemperature() {
  return 2;
}
function minTemperature() {
  return 0;
}
function parametersFromProvider(provider, params) {
  if (provider === "cohere")
    return parametersFromCohere(params);
  if (provider === "anthropic")
    return parametersFromAnthropic(params);
  if (provider === "openai")
    return parametersFromOpenAI(params);
  throw new Error(`Unsupported provider: '${provider}'`);
}
function parametersFromOpenAI(params) {
  const result = {};
  if (params.max_tokens != null)
    result.max_tokens = params.max_tokens;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature * 0.5, 1));
  if (params.top_p != null) {
    result.top_p = params.top_p;
    if (params.top_p === 1e-11)
      result.top_p = 0;
    if (params.top_p === 0.99999999999)
      result.top_p = 1;
  }
  if (params.stream != null)
    result.stream = params.stream;
  return result;
}
function parametersFromAnthropic(params) {
  const result = {};
  if (params.max_tokens_to_sample != null)
    result.max_tokens = params.max_tokens_to_sample;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature / 2, 2));
  if (params.top_p != null)
    result.top_p = params.top_p;
  if (params.stream != null)
    result.stream = params.stream;
  return result;
}
function parametersFromCohere(params) {
  const result = {};
  if (params.max_tokens != null)
    result.max_tokens = params.max_tokens;
  if (params.temperature != null)
    result.temperature = Math.max(0, Math.min(params.temperature * 0.4, 2));
  if (params.p != null) {
    result.top_p = params.p;
    if (params.p === 1e-11)
      result.top_p = 0;
    if (params.p === 0.99999999999)
      result.top_p = 1;
  }
  if (params.stream != null)
    result.stream = params.stream;
  return result;
}
export {
  maxGenerationsPerPrompt,
  maxTemperature,
  minTemperature,
  parameters,
  parametersFromAnthropic,
  parametersFromCohere,
  parametersFromOpenAI,
  parametersFromProvider
};
