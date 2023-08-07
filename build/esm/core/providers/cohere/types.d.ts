export type CohereCompletion = {
    id: string;
    prompt: string;
    generations: Array<{
        id: string;
        text: string;
        index: number;
    }>;
    meta: {};
};
export type CohereParameters = {
    num_generations?: number;
    max_tokens?: number;
    temperature?: number;
    k?: number;
    p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    end_sequences?: string[];
    stop_sequences?: string[];
    logit_bias?: Record<number, number>;
    stream?: boolean;
};
