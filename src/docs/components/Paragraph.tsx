import * as React from "react";
import { paragraphStyle } from "./Paragraph.css";

export function Paragraph({
  children,
  className,
  ...props
}: React.PropsWithChildren<{ className?: string | undefined; style?: React.CSSProperties; }>) {
  return (
    <p {...props} className={`${paragraphStyle} ${className || ""}`}>
      {children}
    </p>
  );
}
