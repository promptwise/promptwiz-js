import { style } from "@vanilla-extract/css";
import { fontFamily } from "./theme";

export const inlineLinkStyle = style({
  fontFamily,
  textDecoration: "none",
  outline: "none",
  ":hover": { textDecoration: "underline" },
  ":focus": { textDecoration: "underline" },
  ":active": { textDecoration: "underline" },
  "@media": {
    "(prefers-color-scheme: dark)": { color: "#ec4545" },
    "(prefers-color-scheme: light)": { color: "#1F93FF" },
  },
});

export const mdnLinkStyle = style({
  fontFamily,
  textDecoration: "none",
  outline: "none",
  ":hover": { textDecoration: "underline" },
  ":focus": { textDecoration: "underline" },
  ":active": { textDecoration: "underline" },
  "@media": {
    "(prefers-color-scheme: dark)": { color: "#8cb4ff" },
    "(prefers-color-scheme: light)": { color: "#0069c2" },
  },
});
