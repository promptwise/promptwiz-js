const chatRegex = /(system|user|assistant):\s*([\s\S]*?)\s*(?=(?:system|user|assistant):|$)/gi;
function convertTextToChatMessages(text) {
  const messages = Array.from(text.matchAll(chatRegex)).map(
    ([_, role, content = ""]) => ({
      role: role.toLowerCase(),
      content
    })
  );
  if (!messages.length && text)
    messages.push({ role: "system", content: text });
  return messages;
}
export {
  convertTextToChatMessages
};
