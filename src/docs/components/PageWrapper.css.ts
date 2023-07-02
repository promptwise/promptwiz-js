import { style } from "@vanilla-extract/css";

export const pageWrapperStyle = style({
  "@media": {
    "screen and (max-width: 1049px)": {
      paddingLeft: 16,
    },
    "screen and (min-width: 1050px)": {
      paddingLeft: 275,
    },
  },
});
