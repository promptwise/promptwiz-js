import * as React from "react";
import {
  navStyle,
  topNavHeaderStyle,
  navLinkStyle,
  navLinkListStyle,
  nestedLinkStyle,
} from "./Navigation.css";

function NestedLinks({ links, level }) {
  return (
    <ul className={`${navLinkListStyle} ${nestedLinkStyle[level]}`}>
      {links.map((l, i) =>
        Array.isArray(l) ? (
          <NestedLinks key={String(i)} links={l} level={level + 1} />
        ) : (
          <li key={String(i)}>
            <a
              href={`#${encodeURIComponent(l.replaceAll(/\s+/g, "-"))}`}
              className={navLinkStyle}
            >
              {l}
            </a>
          </li>
        )
      )}
    </ul>
  );
}

export function DocLinks({
  links,
}: {
  links: Array<Array<string[] | string> | string>;
}) {
  return (
    <nav className={navStyle}>
      <span className={topNavHeaderStyle}>promptwiz-js</span>
      <NestedLinks links={links} level={0} />
      <a
        href="https://github.com/promptwise/promptwiz-js/"
        className={`${navLinkStyle} ${nestedLinkStyle[0]}`}
      >
        GitHub repository
      </a>
    </nav>
  );
}
