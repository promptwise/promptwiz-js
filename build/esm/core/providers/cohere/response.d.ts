export type CohereError = {
    error: {
        type: string;
        message: string;
    };
};
export declare function assessCohereResponse(response: Response): Promise<boolean>;
