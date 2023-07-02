import * as React from "react";
import {
  stickyColumnPairStyle,
  stickyColumnLeftStyle,
  stickyColumnRightStyle,
} from "./StickyColumnPair.css";

export function StickyColumnPair({
  left,
  right,
  className,
}: React.PropsWithChildren<{
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string | undefined;
}>) {
  return (
    <div className={`${stickyColumnPairStyle} ${className || ""}`}>
      <div className={stickyColumnLeftStyle}>{left}</div>
      <div className={stickyColumnRightStyle}>{right}</div>
    </div>
  );
}
