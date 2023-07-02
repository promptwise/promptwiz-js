const { readdir } = require("node:fs/promises");
const esbuild = require("esbuild");
const target = require("./target");

async function getLibFiles() {
  const files = ["./src/index.ts"];
  const dirs = ["./src/core"];
  let dir;
  while ((dir = dirs.pop())) {
    const contents = await readdir(dir, { withFileTypes: true });
    for (const f of contents) {
      if (f.isDirectory() && !dir.startsWith("__"))
        dirs.push(`${dir}/${f.name}`);
      else if (f.isFile() && /\.[tj]sx?$/.test(f.name))
        files.push(`${dir}/${f.name}`);
    }
  }
  return files;
}

async function build() {
  try {
    const entryPoints = await getLibFiles();
    // ESM builds
    await esbuild.build({
      format: "esm",
      entryPoints,
      outdir: "build/esm",
      target,
    });
    await esbuild.build({
      format: "esm",
      entryPoints: ["./src/index.js"],
      outfile: "build/esm/index.bundle.js",
      bundle: true,
      external: ["react"],
      target,
    });
    await esbuild.build({
      format: "esm",
      entryPoints: ["./src/index.js"],
      outfile: "build/esm/index.bundle.min.js",
      bundle: true,
      minify: true,
      external: ["react"],
      target,
    });

    // CJS builds
    await esbuild.build({
      format: "cjs",
      entryPoints,
      outdir: "build/cjs",
      platform: "node",
    });
    await esbuild.build({
      format: "cjs",
      entryPoints: ["./src/index.js"],
      outfile: "build/cjs/index.bundle.js",
      bundle: true,
      platform: "node",
      external: ["react"],
    });
    await esbuild.build({
      format: "cjs",
      entryPoints: ["./src/index.js"],
      outfile: "build/cjs/index.bundle.min.js",
      bundle: true,
      minify: true,
      platform: "node",
      external: ["react"],
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

build();
