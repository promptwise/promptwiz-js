import { styleVariants, style } from "@vanilla-extract/css";
import { codeDemoWrapperStyle } from "./CodeDemo.css";

export const codeLineStyle = styleVariants({
  whitespace: { display: "block" },
  highlighted: {
    display: "block",
    color: "#000",
    backgroundColor: "#33A7FF",
    padding: "4px 8px",
  },
  comment: { display: "block", color: "#777", padding: "4px 8px" },
  code: { display: "block", color: "#000", padding: "4px 8px" },
});

export const codeNameStyle = style({
  display: "block",
  color: "#ffedd3",
  fontSize: "16px",
  lineHeight: "24px",
  // textDecoration: "underline",
  padding: "8px 8px 16px 8px",
  borderBottom: "solid 1px #ffedd3",
  marginBottom: "8px",
});

export const codeBlockStyle = style({
  padding: 8,
  margin: "0 0 16px 0",
  borderRadius: 8,
  fontSize: "14px",
  lineHeight: "16px",
  overflowX: "scroll",
  boxSizing: "border-box",
  border: "solid 1px #ffffff33",
  maxWidth: "calc(min(100vw, 50rem) - 32px)",
  "@media": {
    "(prefers-color-scheme: dark)": { backgroundColor: "#111" },
    "(prefers-color-scheme: light)": { backgroundColor: "#e7f1ff" },
  },
  selectors: {
    [`${codeDemoWrapperStyle} > &`]: {
      paddingBottom: 16,
    },
  },
});

export const inlineCodeStyle = style({
  margin: "0 0 16px 0",
  borderRadius: 6,
  fontSize: "14px",
  overflowX: "scroll",
  border: "solid 1px #ffffff33",
  color: "#000",
  padding: "4px 8px",
  "@media": {
    "(prefers-color-scheme: dark)": { backgroundColor: "#111" },
    "(prefers-color-scheme: light)": { backgroundColor: "#e7f1ff" },
  },
});
