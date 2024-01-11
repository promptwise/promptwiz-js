import { PromptProviderModule } from "../../types";
import { MistralModel } from "./models";
import { MistralCompletion, MistralParameters } from "./types";
export * from "./response";
export declare const mistral: PromptProviderModule<MistralModel, MistralParameters, MistralCompletion>;
