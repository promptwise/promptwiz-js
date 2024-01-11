import { ProviderGenerate } from "../../types";
import { MistralCompletion, MistralParameters } from "./types";
import { MistralModel } from "./models";
export declare const generate: ProviderGenerate<MistralModel, MistralParameters, MistralCompletion>;
