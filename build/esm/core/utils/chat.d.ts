import { ChatMessage } from "../types";
export declare function chatMessage(role: string, content: string): ChatMessage;
export declare const userMessage: (content: string) => ChatMessage;
export declare const systemMessage: (content: string) => ChatMessage;
export declare const assistantMessage: (content: string) => ChatMessage;
