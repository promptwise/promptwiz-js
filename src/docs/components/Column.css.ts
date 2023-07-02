import { styleVariants, style } from "@vanilla-extract/css";

export const columnStyle = style({
  display: "flex",
  flexDirection: "column",
});

export const columnItemStyle = styleVariants({
  0: {},
  1: {
    selectors: {
      [`${columnStyle} > &:not(:first-child)`]: {
        marginTop: 8,
      },
    },
  },
  2: {
    selectors: {
      [`${columnStyle} > &:not(:first-child)`]: {
        marginTop: 16,
      },
    },
  },
  3: {
    selectors: {
      [`${columnStyle} > &:not(:first-child)`]: {
        marginTop: 24,
      },
    },
  },
  4: {
    selectors: {
      [`${columnStyle} > &:not(:first-child)`]: {
        marginTop: 32,
      },
    },
  },
});
