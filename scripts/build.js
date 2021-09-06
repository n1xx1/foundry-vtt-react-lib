const esbuild = require("esbuild");
const { mkdir, copyFile, rm, chmod } = require("fs/promises");

(async () => {
  await rm("dist", { recursive: true, force: true }).catch(() => {});
  await mkdir("dist", 0o777).catch(() => {});

  await copyFile("./static/module.json", "./dist/module.json");
  await chmod("./dist/module.json", 0o777);

  const prod = process.argv[process.argv.length - 1] === "production";
  const watch = process.argv[process.argv.length - 1] === "watch";

  await esbuild.build({
    bundle: true,
    entryPoints: { module: "src/module.ts" },
    outdir: "dist",
    logLevel: "info",
    minify: prod,
    watch: watch,
  });
})();
