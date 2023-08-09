function chatMessage(role, content) {
  return {
    role,
    content
  };
}
const userMessage = (content) => chatMessage("user", content);
const systemMessage = (content) => chatMessage("system", content);
const assistantMessage = (content) => chatMessage("assistant", content);
export {
  assistantMessage,
  chatMessage,
  systemMessage,
  userMessage
};
