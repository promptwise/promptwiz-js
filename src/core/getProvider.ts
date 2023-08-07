import * as providers from "./providers";
import { PromptProviderModule } from "./types";

export function getProvider(
  name: keyof typeof providers
): PromptProviderModule {
  if (!providers[name]) throw new Error(`Unsupported provider: '${name}'`);
  // @ts-expect-error - it's fine
  return providers[name];
}
