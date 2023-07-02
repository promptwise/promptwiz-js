import React from "react";
import {
  Code,
  CodeBlock,
  Column,
  Header,
  MdnLink,
  Paragraph,
  StickyColumnPair,
} from "../components";

export const apiLinks = [
  "API",
  [
    "Promptwiz",
    ["run()", "is_running", "config()"],
    "Providers",
    ["Provider interface", "Supported providers"],
    "Utils",
    [
      "convertChatMessagesToText()",
      "convertTextToChatMessages()",
      "hydratePromptInputs()",
      "parseTemplateStrings()",
    ],
    "Errors",
    ["AbortError", "AuthorizationError", "RateLimitError", "ServerError"],
  ],
];

type ComponentDocsProps = {
  name: string;
  description: Array<string | React.ReactNode>;
  example: string;
  props: Array<{
    name: string;
    description: string | React.ReactNode;
    type: string;
    optional?: boolean;
  }>;
  className?: string | undefined;
};

function ComponentDocs({
  name,
  description,
  props,
  example,
  className,
}: ComponentDocsProps) {
  return (
    <section className={className}>
      <Header level={3} name={name} />
      {description.map((d, i) => (
        <Paragraph key={String(i)}>{d}</Paragraph>
      ))}
      <StickyColumnPair
        left={
          <Column space={2}>
            <Header level={4} name={`${name} Props`}>
              Props
            </Header>
            {props.map((p) => (
              <Paragraph key={p.name}>
                <Header level={5} name={`${name} ${p.name}`}>
                  {p.name}
                  {p.optional ? (
                    <Paragraph style={{ display: "inline", fontWeight: "300" }}>
                      {" "}
                      (optional){" "}
                    </Paragraph>
                  ) : null}
                </Header>
                <Paragraph>
                  <b>Type:</b> <Code>{p.type}</Code>
                  <br />
                  {p.description}
                </Paragraph>
              </Paragraph>
            ))}
          </Column>
        }
        right={
          <Paragraph>
            <Header level={4} name={`${name} Example`}>
              Example
            </Header>
            <CodeBlock>{example}</CodeBlock>
          </Paragraph>
        }
      />
    </section>
  );
}

export function API({ className }: { className?: string | undefined }) {
  return (
    <Column space={2} className={className}>
      <Header level={2} name="API" />
      <Header level={3} name="Promptwiz" />
      <Header level={4} name="run()" />
      <Header level={4} name="is_running" />
      <Header level={4} name="config()" />
      <Header level={3} name="Providers" />
      <Header level={4} name="Provider interface" />
      <Header level={4} name="Supported providers" />
      <Header level={3} name="Utils" />
      <Header level={4} name="convertChatMessagesToText()" />
      <Header level={4} name="convertTextToChatMessages()" />
      <Header level={4} name="hydratePromptInputs()" />
      <Header level={4} name="parseTemplateStrings()" />
      <Header level={3} name="Errors" />
      <Header level={4} name="AbortError" />
      <Header level={4} name="AuthorizationError" />
      <Header level={4} name="RateLimitError" />
      <Header level={4} name="ServerError" />
    </Column>
  );
}
