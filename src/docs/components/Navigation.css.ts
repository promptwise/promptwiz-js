import { styleVariants, style } from "@vanilla-extract/css";
import { fontFamily } from "./theme";

export const navStyle = style({
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  padding: 16,
  overflowY: "auto",
  width: 275,
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  transition: "transform 250ms ease-in-out",
  "@media": {
    "screen and (max-width: 1049px)": {
      transform: "translateX(calc(-100% + 16px))",
      ":focus-within": {
        transform: "translateX(0)",
      },
      ":hover": {
        transform: "translateX(0)",
      },
    },
    "screen and (min-width: 1050px)": {
      transform: "translateX(0)",
    },
    "(prefers-color-scheme: dark)": {
      backgroundColor: "#1F93FF",
    },
    "(prefers-color-scheme: light)": {
      backgroundColor: "#0074E0",
    },
  },
});

export const navLinkStyle = style({
  fontFamily,
  color: "#ffe",
  textDecoration: "none",
  outline: "none",
  ":hover": { textDecoration: "underline", color: "#fff" },
  ":focus": { textDecoration: "underline", color: "#fff" },
  ":active": { textDecoration: "underline", color: "#fff" },
});

export const nestedLinkStyle = styleVariants({
  0: { margin: 0, fontSize: "18px", lineHeight: "32px" },
  1: { margin: "0 0 0 24px", fontSize: "16px", lineHeight: "26px" },
  2: { margin: "0 0 0 24px", fontSize: "14px", lineHeight: "26px" },
});

export const navLinkListStyle = style({
  padding: 0,
  listStyleType: "none",
});

export const topNavHeaderStyle = style({
  fontFamily,
  color: "#eee",
  fontWeight: 700,
  fontSize: "32px",
  lineHeight: "36px",
  paddingBottom: "16px",
  textDecoration: "none",
});
