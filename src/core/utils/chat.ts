import { ChatMessage } from "../types";

export function chatMessage(role: string, content: string): ChatMessage {
  return {
    role,
    content,
  };
}

export const userMessage = (content: string) => chatMessage("user", content);

export const systemMessage = (content: string) =>
  chatMessage("system", content);

export const assistantMessage = (content: string) =>
  chatMessage("assistant", content);
