const template_regex = /<(\w+)>/g;
function parseStrings(value) {
  const matches = [];
  let match;
  while ((match = template_regex.exec(value)) !== null)
    matches.push(match[1]);
  return matches;
}
function parseTemplateStrings(value) {
  const res = new Set(
    typeof value === "string" ? parseStrings(value) : value.reduce(
      (list, chat) => list.concat(parseStrings(chat.content)),
      []
    ).filter(Boolean)
  );
  return Array.from(res.values());
}
export {
  parseTemplateStrings,
  template_regex
};
