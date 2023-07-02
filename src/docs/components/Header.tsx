import * as React from "react";
import { headerStyle, headerLevelStyle } from "./Header.css";

export function Header({
  level,
  name,
  className,
  children,
}: React.PropsWithChildren<{
  level: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  className?: string | undefined;
}>) {
  const Tag = `h${level}` as keyof typeof headerLevelStyle;

  return (
    <Tag
      className={`${headerStyle} ${headerLevelStyle[Tag]} ${className || ""}`}
      id={encodeURIComponent(name.replaceAll(/\s+/g, "-"))}
    >
      {children || name}
    </Tag>
  );
}
