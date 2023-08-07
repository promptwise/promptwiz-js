import { ModelData } from "../../types";
export declare const models: {
    readonly command: ModelData;
    readonly "command-light": ModelData;
    readonly "command-nightly": ModelData;
    readonly "command-light-nightly": ModelData;
};
export type CohereModel = keyof typeof models;
export declare const promptDollarCostForModel: (model: CohereModel, input_tokens: number, output_tokens: number) => number;
export declare const maxTokensForModel: (model: CohereModel) => number;
export declare const encoderNameForModel: (model: CohereModel) => "cohere_75k";
