import { ModelData } from "../../types";
export declare const models: {
    readonly "mistral-tiny": ModelData;
    readonly "mistral-small": ModelData;
    readonly "mistral-medium": ModelData;
};
export type MistralModel = keyof typeof models;
export declare const promptDollarCostForModel: (model: MistralModel, input_tokens: number, output_tokens: number) => number;
export declare const maxTokensForModel: (model: MistralModel) => number;
export declare const encoderNameForModel: (model: MistralModel) => "mistral_32k";
