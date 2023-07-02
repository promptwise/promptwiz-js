import { style } from "@vanilla-extract/css";

export const stickyColumnPairStyle = style({
  display: "flex",
  "@media": {
    "screen and (max-width: 1849px)": { flexDirection: "column" },
    "screen and (min-width: 1850px)": { flexDirection: "row" },
    "(prefers-color-scheme: dark)": { backgroundColor: "#222" },
    "(prefers-color-scheme: light)": { backgroundColor: "#fff" },
  },
});

export const stickyColumnLeftStyle = style({
  "@media": {
    "screen and (max-width: 1849px)": { marginBottom: 16 },
    "screen and (min-width: 1850px)": { marginRight: 16 },
  },
});
export const stickyColumnRightStyle = style({
  "@media": {
    "screen and (min-width: 1850px)": {},
  },
});
