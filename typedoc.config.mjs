/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
  out: ".docs",
  tsconfig: "tsconfig.json",
  entryPoints: ["app", "components", "lib"],
  entryPointStrategy: "expand",
  useTsLinkResolution: true,
  skipErrorChecking: true,
  plugin: ["typedoc-github-theme"]
}

export default config
