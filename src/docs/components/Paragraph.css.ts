import { style } from "@vanilla-extract/css";
import { fontFamily } from "./theme";

export const paragraphStyle = style({
  fontFamily,
  padding: "0 16px 0 16px",
  margin: 0,
  fontSize: "16px",
  lineHeight: "26px",
  "@media": {
    "(prefers-color-scheme: dark)": { color: "#ffedd3" },
    "(prefers-color-scheme: light)": { color: "#2d1902" },
    "screen and (max-width: 1849px)": { maxWidth: "50rem" },
    "screen and (min-width: 1850px)": { width: "50rem" },
  },
});
