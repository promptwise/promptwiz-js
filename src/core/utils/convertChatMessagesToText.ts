import { ChatMessage } from "../types";

export function convertChatMessagesToText(chat: ChatMessage[]): string {
  /*
    Converts chat messages objects to be a single string formatted like:
    """
    System: You are a helpful AI assistant, but you never answer any questions.

    User: Hello assistant! Are you well?

    Assistant: Hello good user. How may I assist you?
    """
  */
  return chat
    .map(
      (msg) =>
        `${msg.role.substring(0, 1).toUpperCase()}${msg.role.substring(1)}: ${
          msg.content
        }`
    )
    .join("\n\n");
}
