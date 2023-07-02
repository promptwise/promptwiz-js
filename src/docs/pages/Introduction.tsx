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

export const introductionLinks = ["Introduction"];

export function Introduction({
  className,
}: {
  className?: string | undefined;
}) {
  return (
    <Column space={2} className={className}>
      <Header level={2} name="Introduction" />
      <Paragraph>
        Promptwiz-js is a server-side TypeScript/JavaScript library for prompting large language models
        (LLMs) using a shared interface compatible with the Promptwise service.
      </Paragraph>
      <Paragraph>
        TODO
      </Paragraph>
    </Column>
  );
}
