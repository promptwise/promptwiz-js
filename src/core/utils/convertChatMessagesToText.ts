import { ChatMessage } from "../types";

export function convertChatMessagesToText(chat: ChatMessage[]): string {
  /*
    Converts chat messages objects to be a single string formatted like:
    """
    SYSTEM: You are a helpful AI assistant, but you never answer any questions.

    USER: Hello assistant! Are you well?

    ASSISTANT: Hello good user. How may I assist you?
    """
  */
  return chat
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n\n");
}