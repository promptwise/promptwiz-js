import { PromptProviderModule } from "../../types";
import { CohereModel } from "./models";
import { CohereCompletion, CohereParameters } from "./types";
export * from "./response";
export declare const cohere: PromptProviderModule<CohereModel, CohereParameters, CohereCompletion>;
