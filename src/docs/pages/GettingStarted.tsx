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

export const gettingStartedLinks = [
  "Getting started",
  ["Install the library", "Get provider api keys", "Build a prompt"],
];

export function GettingStarted({
  className,
}: {
  className?: string | undefined;
}) {
  return (
    <Column space={2} className={className}>
      <Header level={2} name="Getting started" />
      <Paragraph>
        Follow these instructions to get promptwiz-js setup in your project.
      </Paragraph>
      <Header level={3} name="Install the library" />
      <Paragraph>
        promptwiz-js is hosted on npm, so you can use npm or any npm-compatible
        package manager to install it.
      </Paragraph>
      <Paragraph>
        <CodeBlock>npm install --save promptwiz-js</CodeBlock>
      </Paragraph>
      <Header level={3} name="Get provider api keys" />
      <Paragraph>
        Promptwiz-js does not automatically provide access to LLMs, so you'll
        need to get the appropriate access token/key needed to talk to that
        provider's api before you can run any prompts with the library.
      </Paragraph>
      <Header level={3} name="Build a prompt" />
      <Paragraph>
        Todo
      </Paragraph>
      <Paragraph>
        Todo
      </Paragraph>
    </Column>
  );
}
