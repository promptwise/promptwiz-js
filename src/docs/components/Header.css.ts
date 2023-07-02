import { styleVariants, style } from "@vanilla-extract/css";
import { fontFamily } from "./theme";

export const headerStyle = style({
  fontFamily,
  fontWeight: 700,
  color: "#1F93FF",
  margin: 0,
});

export const headerLevelStyle = styleVariants({
  h1: {
    fontSize: "56px",
    padding: "32px 0 8px 0",
  },
  h2: {
    fontSize: "36px",
    padding: "24px 0 8px 0",
  },
  h3: {
    fontSize: "24px",
    padding: "16px 0 8px 0",
  },
  h4: {
    fontSize: "20px",
    padding: "16px 0 8px 0",
  },
  h5: {
    fontSize: "18px",
    padding: "16px 0 8px 0",
  },
  h6: {
    fontSize: "16px",
    padding: "16px 0 8px 0",
  },
});
