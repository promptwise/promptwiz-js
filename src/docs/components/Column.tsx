import * as React from "react";
import { columnStyle, columnItemStyle } from "./Column.css";

export function Column({
  className,
  space,
  children,
}: React.PropsWithChildren<{
  space: keyof typeof columnItemStyle;
  className?: string | undefined;
}>) {
  return (
    <div className={`${columnStyle} ${className || ""}`}>
      {React.Children.map(children, (c) =>
        React.isValidElement(c)
          ? {
              ...c,
              props: {
                ...c.props,
                className: `${columnItemStyle[space]} ${
                  c.props.className || ""
                }`,
              },
            }
          : c
      )}
    </div>
  );
}
