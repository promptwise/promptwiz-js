function convertChatMessagesToText(chat) {
  return chat.map(
    (msg) => `${msg.role.substring(0, 1).toUpperCase()}${msg.role.substring(1)}: ${msg.content}`
  ).join("\n\n");
}
export {
  convertChatMessagesToText
};
