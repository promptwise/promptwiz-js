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
    ["Interface", "Tokenizer", "Anthropic", "Cohere", "OpenAI"],
    "Utils",
    [
      "convertChatMessagesToText()",
      "convertTextToChatMessages()",
      "hydratePromptInputs()",
      "parseTemplateStrings()",
    ],
    "Errors",
    [
      "AbortError",
      "AuthorizationError",
      "AvailabilityError",
      "ClientError",
      "ParserError",
      "RateLimitError",
      "ServerError",
      "ServiceQuotaError",
    ],
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
      <Header level={4} name="Interface" />
      <Header level={4} name="Tokenizer" />
      <Header level={4} name="Anthropic" />
      <Header level={4} name="Cohere" />
      <Header level={4} name="OpenAI" />

      <Header level={3} name="Utils" />
      <Header level={4} name="convertChatMessagesToText()" />
      <Header level={4} name="convertTextToChatMessages()" />
      <Header level={4} name="hydratePromptInputs()" />
      <Header level={4} name="parseTemplateStrings()" />

      <Header level={3} name="Errors" />
      <Paragraph>
        Promptwiz defines and exports several error classes to standardize error
        handling across multiple providers.
      </Paragraph>
      <Header level={4} name="AbortError" />
      <Paragraph>
        Returned if the request was aborted via the AbortSignal.
      </Paragraph>
      <Header level={4} name="AuthorizationError" />
      <Paragraph>
        Returned if we're missing the <Code>access_token</Code> or if it's
        invalid or stale.
      </Paragraph>
      <Header level={4} name="AvailabilityError" />
      <Paragraph>
        Currently only supported by Anthropic, this error will be returned if
        the provider tells us their servers are overloaded/unavailable.
      </Paragraph>
      <Header level={4} name="ClientError" />
      <Paragraph>
        Returned if we there is a client error in the request made to the
        provider--usually due to incorrect parameters.
      </Paragraph>
      <Header level={4} name="ParserError" />
      <Paragraph>
        Returned if we get rate-limited by the provider. If using a `run` method
        and the <Code>retry_if_parser_fails</Code> config boolean Promptwiz will
        automatically retry on these errors up to the <Code>max_retries</Code>{" "}
        config value (defaults is 3 retries).
      </Paragraph>
      <Header level={4} name="RateLimitError" />
      <Paragraph>
        Returned if we get rate-limited by the provider. If using a `run` method
        Promptwiz will automatically retry on these errors up to the{" "}
        <Code>max_retries</Code> config value (defaults is 3 retries).
      </Paragraph>
      <Header level={4} name="ServerError" />
      <Paragraph>
        Returned if we get an unexpected error from the provider
      </Paragraph>
      <Header level={4} name="ServiceQuotaError" />
      <Paragraph>
        Returned if full service quota with provider has been exhausted for the
        current billing period
      </Paragraph>
    </Column>
  );
}
