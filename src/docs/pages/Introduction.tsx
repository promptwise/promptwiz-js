import React from "react";
import {
  CodeBlock,
  Code,
  Column,
  Header,
  Paragraph,
  StickyColumnPair,
  DocLink,
} from "../components";

export const introductionLinks = ["Introduction", ["Should I use promptwiz?"]];

export function Introduction({
  className,
}: {
  className?: string | undefined;
}) {
  return (
    <Column space={2} className={className}>
      <Header level={2} name="Introduction" />
      <Paragraph>
        Promptwiz-js is a JavaScript/TypeScript library for prompting large
        language models (LLMs) from various providers as well as tokenizing
        their inputs, outputs, and calculating prompt costs, with robust
        fallback strategies and error handling for increased reliability.
      </Paragraph>
      <Paragraph>Supported providers: Anthropic, Cohere, and OpenAI</Paragraph>
      <Paragraph>Here's an example:</Paragraph>
      <CodeBlock>{`import { promptwiz } from "@promptwise/promptwiz-js";

const prompter = promptwiz({
  provider: "openai",
  access_token: "MY_SECRET_TOKEN",
  model: "gpt-3.5-turbo",
  prompt: "Say hello to my little friend!",
  parameters: {
    // full-passthrough -- can use any parameter supported by the provider's api
    temperature: 0.7,
    n: 3,
    max_tokens: 10
  },
  // Default number of retries is 3
  max_retries: 6
});

const result = await prompter.run();
console.log(result);
// {
//   outputs: [
//     {
//       content: "As an AI Assistant trained by OpenAI, I",
//       tokens: 10,
//       truncated: true
//     },
//     {
//       content: "Hello! How can I help you today?",
//       tokens: 9,
//       truncated: false
//     }
//   ],
//   original: {
//     ...full provider response available here...
//   },
//   useage: {
//     input_tokens: 7,
//     output_tokens: 19,
//     cost: 0.0000485, // Cost in US dollars
//     retries: 1
//   }
// }
`}</CodeBlock>
      <Header level={3} name="Should I use promptwiz?" />
      <Paragraph>
        Promptwiz focuses strictly on generative use cases and makes no effort
        to support other more specific models or apis, nor does it work with
        custom models at this time.
      </Paragraph>
      <Paragraph>
        So if your use cases are more specific, or are focused on non-generative
        use cases then promptwiz likely isn't for you. Additionally if you're
        set on using a single provider, you may be better served using their SDK
        directly. Lastly if you need a leaner deployment unencumbered by the
        tokenizer, then you may also be better served by another library. Note
        that promptwiz has an api for generating text without any tokenization,
        so if you prefer to run any tokenization out of band of your prompts,
        that is supported.
      </Paragraph>
    </Column>
  );
}
