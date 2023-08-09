import React from "react";
import {
  Code,
  CodeBlock,
  Column,
  DocLink,
  Header,
  MdnLink,
  Paragraph,
  StickyColumnPair,
} from "../components";

export const conceptsLinks = [
  "Concepts",
  [
    "Lifecycle",
    "Configuration",
    ["Provider", "Controller", "Prompt"],
    "Layered runtime",
    "Prompts",
    ["Text prompt", "Chat prompt"],
    "Inputs",
    ["Named inputs", "Chat input"],
  ],
];

export function Concepts({ className }: { className?: string | undefined }) {
  return (
    <Column space={2} className={className}>
      <Header level={2} name="Concepts" />

      <Header level={3} name="Library structure" />
      <Paragraph>
        If you intend to 
      </Paragraph>
      <Header level={3} name="Configuration" />
      {/* <Paragraph>
        HTML forms submit data all at once when the form fields are valid, and
        the user triggers the submit event--usually clicking a submit button.
        Depending on some of the attributes set on the form element the form
        values will be submitted via HTTP to an url specified with the form
        values submitted as FormData or query parameters in the request url. You
        can read more about this from these MDN docs about{" "}
        <MdnLink href="https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data">
          sending and retreiving form data
        </MdnLink>
        .
      </Paragraph> */}
      <Header level={4} name="Provider" />
      <Paragraph>TODO</Paragraph>
      <Header level={4} name="Controller" />
      <Paragraph>TODO</Paragraph>
      <Header level={4} name="Prompts" />
      <Paragraph>
        The "prompt" is the foundation of today's generative AI and is simply
        the natural language text that is fed into the model that drives it's
        output. Using natural language is tremendously flexible which can be a
        double-edged sword.
      </Paragraph>
      <Paragraph>
        Promptwiz supports the traditional plain-text prompt format as well as
        OpenAI's new chat message object format, and will automatically convert
        your prompt from one to the other as appropriate as needed given the
        model you use, so you're free to use the one you prefer most.
      </Paragraph>
      <Header level={5} name="Text prompt" />
      <Paragraph>
        The text prompt can be anything depending on your generative needs and
        is typically uncontrained by notions of conversation--though this is not
        a hard rule. Prompts in this format allow for more specific behaviors
        and outputs from the model.
      </Paragraph>
      <CodeBlock>{`You are an expert at tootsie-popology.

Question: How many licks does it take to get to the center of a tootsie pop?

Answer:`}</CodeBlock>
      <Header level={5} name="Chat prompt" />
      <Paragraph>
        The chat prompt is simply a sequence of text messages between user(s)
        and assistant(s), and for models that support this structure the model
        will attempt to fill the role of an assistant.
      </Paragraph>
      <CodeBlock>{`[
  {
    role: "system",
    content: "You are an expert at tootsie-popology."
  }
  {
    role: "user",
    content: "How many licks does it take to get to the center of a tootsie pop?"
  }
]`}</CodeBlock>
    </Column>
  );
}
