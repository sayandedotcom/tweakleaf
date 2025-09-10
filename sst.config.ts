/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "tweakleaf",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const infra = await import("./infra");
    console.log(process.env.SOME_ENV_VAR); // FOO
    return {
      apiDomain: infra.apiRouter,
      frontendDomain: infra.frontend,
      tweakDomain: infra.tweakApi,
      compilerDomain: infra.compilerApi,
    };
  },
});
