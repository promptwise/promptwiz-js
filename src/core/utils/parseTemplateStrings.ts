export const template_regex = /<(\w+)>/g;

function parseStrings(value: string): string[] {
  const matches = [];
  let match;
  while ((match = template_regex.exec(value)) !== null) matches.push(match[1]);
  return matches;
}

export function parseTemplateStrings(
  value: string | Array<{ content: string }>
): string[] {
  const res = new Set(
    typeof value === "string"
      ? parseStrings(value)
      : value
          .reduce(
            (list, chat) => list.concat(parseStrings(chat.content)),
            [] as string[]
          )
          .filter(Boolean)
  );
  return Array.from(res.values());
}
