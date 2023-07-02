const { vanillaExtractPlugin } = require("@vanilla-extract/esbuild-plugin");
const esbuild = require("esbuild");
const target = require("./target");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

async function processCss(css) {
  const result = await postcss([autoprefixer]).process(css, {
    from: undefined /* suppress source map warning */,
  });

  return result.css;
}
esbuild
  .build({
    entryPoints: ["./src/docs/index.js"],
    bundle: true,
    minify: true,
    plugins: [
      vanillaExtractPlugin({
        processCss,
      }),
    ],
    outfile: "docs/index.bundle.min.js",
    target,
  })
  .catch(() => process.exit(1));
