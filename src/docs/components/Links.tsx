import * as React from "react";
import { inlineLinkStyle, mdnLinkStyle } from "./Links.css";

export function MdnLink({
  children,
  href,
}: React.PropsWithChildren<{ href: string }>) {
  return (
    <a href={href} className={mdnLinkStyle} target="_blank">
      {children}
    </a>
  );
}

export function DocLink({ name }: { name: string }) {
  return (
    <a
      href={`#${encodeURIComponent(name.replaceAll(/\s+/g, "-"))}`}
      className={inlineLinkStyle}
    >
      {name}
    </a>
  );
}
