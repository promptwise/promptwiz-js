import * as React from "react";
import {
  codeBlockStyle,
  codeLineStyle,
  codeNameStyle,
  inlineCodeStyle,
} from "./Code.css";

const commentRegex = /^\s*(?:\/\/)|(?:\/\*)/;
const whiteSpaceRegex = /^\s*$/;

export function CodeBlock({
  name,
  highlight,
  className,
  children,
}: React.PropsWithChildren<{
  name?: string;
  highlight?: number[];
  className?: string | undefined;
}>) {
  return (
    <pre arial-label={name} className={`${codeBlockStyle} ${className || ""}`}>
      {name ? <code className={codeNameStyle}>{name}</code> : null}
      {children.split("\n").map((v, i) => (
        <code
          key={String(i)}
          className={
            codeLineStyle[
              highlight?.includes(i)
                ? "highlighted"
                : whiteSpaceRegex.test(v)
                ? "whitespace"
                : commentRegex.test(v)
                ? "comment"
                : "code"
            ]
          }
        >
          {v || "  "}
        </code>
      ))}
    </pre>
  );
}

export function Code({ children }: React.PropsWithChildren<{}>) {
  return <code className={inlineCodeStyle}>{children}</code>;
}
