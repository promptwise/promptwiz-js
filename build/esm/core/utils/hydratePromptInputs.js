import { parseTemplateStrings } from "./parseTemplateStrings";
function hydratePromptInputs(prompt, inputs) {
  const templates = parseTemplateStrings(prompt);
  if (!templates.length)
    return prompt;
  if (typeof prompt === "string") {
    for (const key of templates) {
      prompt = prompt.replaceAll(`<${key}>`, inputs[key]);
    }
  } else {
    prompt = JSON.parse(JSON.stringify(prompt));
    for (const key of templates) {
      if (key === "chat_inputs") {
        prompt = prompt.concat(JSON.parse(inputs[key]));
      } else {
        for (const msg of prompt) {
          msg.content = msg.content.replaceAll(`<${key}>`, inputs[key]);
        }
      }
    }
  }
  return prompt;
}
export {
  hydratePromptInputs
};
