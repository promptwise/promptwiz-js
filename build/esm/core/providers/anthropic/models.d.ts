import { ModelData } from "../../types";
export declare const models: {
    readonly "claude-1": ModelData;
    readonly "claude-instant-1.1": ModelData;
    readonly "claude-2.0": ModelData;
    readonly "claude-instant-1": ModelData;
    readonly "claude-2": ModelData;
};
export type AnthropicModel = keyof typeof models;
export declare const promptDollarCostForModel: (model: AnthropicModel, input_tokens: number, output_tokens: number) => number;
export declare const maxTokensForModel: (model: AnthropicModel) => number;
export declare const encoderNameForModel: (model: AnthropicModel) => "anthropic_64k";
