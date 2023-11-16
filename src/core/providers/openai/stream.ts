import { StreamHandler } from "../../types";
import { assessOpenAIResponse } from "./response";

export function fetchStream(
  streamHandler: StreamHandler,
  isChat = true
): typeof fetch {
  return async (url, init) =>
    new Promise(async (resolve, reject) => {
      const response = await fetch(url, init);
      try {
        assessOpenAIResponse(response);
      } catch (error) {
        reject(error);
      }
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      //@ts-expect-error - later
      let allResponses = [];
      // Function to process each chunk
      async function processChunk() {
        try {
          const { done, value } = await reader.read();
          if (done) {
            streamHandler([], true);
            //@ts-expect-error - later
            const combined = allResponses.reduce(
              ({ choices }, chunk) => {
                chunk.choices.forEach(
                  isChat
                    ? //@ts-expect-error - later
                      ({ delta, index, ...other }) => {
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
                      }
                    : //@ts-expect-error - later
                      ({ text, index, ...other }) => {
                        choices[index] = {
                          ...choices[index],
                          ...other,
                          text: `${choices[index]?.text}${text || ""}`,
                        };
                      }
                );
                return {
                  ...chunk,
                  choices,
                };
              },
              { choices: [] }
            );
            return resolve(combined);
          }
          const chunk = JSON.parse(decoder.decode(value));
          allResponses.push(chunk);
          streamHandler(
            //@ts-expect-error - later
            chunk.choices.map((c) => ({
              delta: isChat ? c.delta : c.text,
              index: c.index,
            })),
            false
          );
          processChunk();
        } catch (error) {
          reject(error);
        }
      }
      processChunk();
    });
}
