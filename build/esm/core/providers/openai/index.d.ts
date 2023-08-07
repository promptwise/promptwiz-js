import { PromptProviderModule } from "../../types";
import { OpenAIModel } from "./models";
import { OpenAICompletion, OpenAIParameters } from "./types";
export declare const openai: PromptProviderModule<OpenAIModel, OpenAIParameters, OpenAICompletion>;
