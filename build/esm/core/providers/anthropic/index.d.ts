import { PromptProviderModule } from "../../types";
import { AnthropicModel } from "./models";
import { AnthropicCompletion, AnthropicParameters } from "./types";
export declare const anthropic: PromptProviderModule<AnthropicModel, AnthropicParameters, AnthropicCompletion>;
