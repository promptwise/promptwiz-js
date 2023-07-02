import { styleVariants, style } from "@vanilla-extract/css";

export const codeDemoWrapperStyle = style({
  borderRadius: 8,
  "@media": {
    "(prefers-color-scheme: dark)": { backgroundColor: "#111" },
    "(prefers-color-scheme: light)": { backgroundColor: "#333" },
  },
});

export const logsWrapperStyle = style({
  padding: 16,
  paddingTop: 24,
  borderRadius: 8,
  margin: 0,
  fontSize: "14px",
  boxSizing: "border-box",
  border: "solid 1px #ffffff33",
  overflowX: "scroll",
  maxWidth: "calc(min(100vw, 50rem) - 32px)",
  maxHeight: "240px",
  overflowY: "scroll",
});

export const formWrapperStyle = style({
  borderRadius: 8,
  margin: "-12px 0 -12px 0",
  backgroundColor: "white",
  color: "black",
  padding: 16,
});

export const logLineStyle = style({
  display: "block",
  lineHeight: "24px",
  color: "#eee",
});
