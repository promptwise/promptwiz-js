const chatRegex = /(system|user|human|assistant):\s*([\s\S]*?)\s*(?=(?:system|user|human|assistant):|$)/gi;
function convertTextToChatMessages(text) {
  const messages = Array.from(text.matchAll(chatRegex)).map(
    ([_, role, content = ""]) => {
      role = role.toLowerCase();
      return {
        role: role === "human" ? "user" : role,
        content
      };
    }
  );
  if (!messages.length && text)
    messages.push({ role: "system", content: text });
  return messages;
}
export {
  convertTextToChatMessages
};
