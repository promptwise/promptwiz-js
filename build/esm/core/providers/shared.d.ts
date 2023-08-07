import { ProviderModelRecord } from "../types";
export declare function _promptDollarCostForModel(records: ProviderModelRecord, model: string, input_tokens: number, output_tokens: number): number;
export declare function _maxTokensForModel(records: ProviderModelRecord, model: string): number;
export declare function _encoderNameForModel(records: ProviderModelRecord, model: string): string;
