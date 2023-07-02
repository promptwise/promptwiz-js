import { ChatMessage } from "../types";

const chatRegex =
  /(system|user|assistant):\s*([\s\S]*?)\s*(?=(?:system|user|assistant):|$)/gi;

export function convertTextToChatMessages(text: string): ChatMessage[] {
  /*
    Converts text string containing chat messages to be a parsed into a chat message object array. (see convertChatMessagesToText for text formatting example)
  */
  const messages = Array.from(text.matchAll(chatRegex)).map(
    ([_, role, content = ""]) => ({
      role: role.toLowerCase(),
      content,
    })
  );
  if (!messages.length && text)
    messages.push({ role: "system", content: text });
  return messages;
}
