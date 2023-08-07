import { ProviderGenerate } from "../../types";
import { OpenAICompletion, OpenAIParameters } from "./types";
import { OpenAIModel } from "./models";
export declare const generate: ProviderGenerate<OpenAIModel, OpenAIParameters, OpenAICompletion>;
