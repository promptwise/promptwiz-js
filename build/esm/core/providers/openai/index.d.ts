import { PromptProviderModule } from "../../types";
import { OpenAIModel } from "./models";
import { OpenAICompletion, OpenAIParameters } from "./types";
export * from "./response";
export declare const openai: PromptProviderModule<OpenAIModel, OpenAIParameters, OpenAICompletion>;
