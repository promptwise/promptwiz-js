import { StreamHandler } from "../../types";
import { assessMistralResponse } from "./response";

export function fetchStream(
  streamHandler: StreamHandler,
  isChat = true
): typeof fetch {
  return async (url, init) =>
    new Promise(async (resolve, reject) => {
      const response = await fetch(url, init);
      try {
        assessMistralResponse(response);
      } catch (error) {
        reject(error);
      }
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      //@ts-expect-error - later
      let allResponses = [];
      let buffer_text = "";
      // Function to process each chunk
      async function processChunk() {
        try {
          const { done, value } = await reader.read();
          if (done) {
            streamHandler([], true);
            //@ts-expect-error - later
            const combined = allResponses.reduce(
              ({ choices }, chunk) => {
                //@ts-expect-error - later
                chunk.choices.forEach(({ delta, index, ...other }) => {
                  const prev = choices[index]?.message;
                  choices[index] = {
                    ...choices[index],
                    ...other,
                    message: {
                      role: prev?.role || delta.role || "assistant",
                      content: `${prev?.content}${
                        delta?.message?.content || ""
                      }`,
                    },
                  };
                });
                return {
                  ...chunk,
                  choices,
                };
              },
              { choices: [] }
            );
            return resolve(combined);
          }
          const txt = decoder.decode(value);
          buffer_text = `${buffer_text}${
            txt.startsWith("data: ") ? "\n\n" : ""
          }${txt}`;
          const chunks = buffer_text.split("\n\n");
          buffer_text = chunks.pop() || "";
          let obj;
          for (const chunk of chunks) {
            if (!chunk.trim() || chunk.includes("data: [DONE]")) continue;
            obj = JSON.parse(chunk.trim().slice(6));
            allResponses.push(obj);
            streamHandler(
              //@ts-expect-error - later
              obj.choices.map((c) => ({
                delta: c.delta,
                index: c.index,
              })),
              false
            );
          }
          processChunk();
        } catch (error) {
          reject(error);
        }
      }
      processChunk();
    });
}
