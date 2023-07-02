import * as React from "react";
import { pageWrapperStyle } from "./PageWrapper.css";

export function PageWrapper({ children }: React.PropsWithChildren<{}>) {
  return <div className={pageWrapperStyle}>{children}</div>;
}
