function convertChatMessagesToText(chat) {
  return chat.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");
}
export {
  convertChatMessagesToText
};
