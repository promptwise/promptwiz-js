import * as providers from "./providers";
import { PromptProviderModule } from "./types";
export declare function getProvider(name: keyof typeof providers): PromptProviderModule;
