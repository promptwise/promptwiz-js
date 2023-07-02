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
    "Inputs",
    [
      "Named inputs",
      "Chat input",
    ]
  ],
];

export function Concepts({ className }: { className?: string | undefined }) {
  return (
    <Column space={2} className={className}>
      <Header level={2} name="Concepts" />

      <Header level={3} name="Lifecycle" />
      <Paragraph>
        The backbone of every web application is the form. You want to accept
        normalized inputs from your users, and submit these values painless to
        your server, or manipulate easily in JavaScript. promptwiz-js does its
        best to follow native HTML form conventions so that you can build forms
        with progressive enhancement in mind.
      </Paragraph>
      <Paragraph>
        The form is really a composition of several components: the Form, the
        Field(s), and the Submit button. The Form component generally wraps all
        the fields within the form, and which governs how the data will be
        submitted. Inside your Form, you'll have one or more normalized or
        freeform Field components for your user to enter data, and upon which
        you can have more specific validation rules to help your users fill
        things out correctly. Finally you'll typically have a Submit button in
        your form which will trigger a final validation, and if all is valid:
        submit the values just as you've specified.
      </Paragraph>
      <Header level={3} name="Configuration" />
      <Paragraph>
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
      </Paragraph>
      <Header level={4} name="Provider" />
      <Paragraph>
        TODO
      </Paragraph>
      <Header level={4} name="Controller" />
      <Paragraph>
        TODO
      </Paragraph>
      <Header level={4} name="Prompt" />
      <Paragraph>
        TODO
      </Paragraph>

      <Header level={3} name="Inputs" />
      <Paragraph>
        Validating form inputs is a vital part of forms, and part of what gives
        software such tremendous power over paper forms. Validation can be run
        at the field level, on change, on blur, and can be run at the form level
        to reference multiple values for more complex validation. Validation
        will never prevent the user from entering a value, but it will always
        block the user from submitting a form with any invalid values.
      </Paragraph>
      <Header level={4} name="Named inputs" />
      <Paragraph>
        Validation is built right on top of the native{" "}
        <MdnLink href="https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation">
          form validation
        </MdnLink>
        . If you're rendering to a static, potentially JavaScript-less context
        then this is the only validation available which isn't perfect, but is
        better than nothing.
      </Paragraph>
      <Header level={4} name="Chat input" />
      <Paragraph>
        Every field accepts a validation function which you can use to
        accomplish your specific validation above what the native form provides.
        The validation function is passed the current field value at time of
        exectution and can return an error string to display.
      </Paragraph>
      <Paragraph>
        Field level can be run on field change (which for text fields means
        every key stroke), or on blur. Additionally, field-level validation is
        run every time a form submission is attempted.
      </Paragraph>
    </Column>
  );
}
