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
  [
    "Install the library",
    "Environment-specific setup",
    "Get provider api keys",
    "Build a prompt",
  ],
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
      <CodeBlock>npm install --save @promptwise/promptwiz-js</CodeBlock>
      <Header level={3} name="Environment-specific setup" />
      <Paragraph>
        Promptwiz uses the <Code>fetch()</Code> function, and should work in any
        javascript environment that exposes it in the global scope.
      </Paragraph>
      <Paragraph>
        NodeJS users will need to use the <Code>node-fetch</Code> package to
        polyfill.
      </Paragraph>
      <Paragraph>
        Deno users have the fetch function, but may encounter difficulty in
        importing the library. You will need to use the <Code>npm:</Code> compat
        import syntax, or failing that you can import directly from the raw path
        to the esm build in github.
      </Paragraph>
      <Header level={3} name="Get provider api keys" />
      <Paragraph>
        Promptwiz-js does not automatically provide access to LLMs, so you'll
        need to get the appropriate access token/key needed to talk to that
        provider's api before you can run any prompts with the library.
      </Paragraph>
      <Header level={3} name="Build a prompt" />
      <Paragraph>Todo</Paragraph>
      <Paragraph>Todo</Paragraph>
    </Column>
  );
}
