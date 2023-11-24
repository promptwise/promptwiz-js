export type AnthropicError = {
    error: {
        type: string;
        message: string;
    };
};
export declare function assessAnthropicResponse(response: Response): Promise<boolean>;
