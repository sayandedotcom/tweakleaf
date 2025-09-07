/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "latex",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const compiler = new sst.aws.Function("Compiler", {
      python: {
        container: true,
      },
      handler: "compiler/src/compiler/api.handler",
      runtime: "python3.10",
      url: true,
    });

    return {
      compilerDomain: compiler.url,
    };
  },
});
