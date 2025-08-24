/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "ai",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const fastapi = new sst.aws.Function("FastAPI", {
      handler: "functions/src/functions/api.handler",
      runtime: "python3.10",
      url: true,
    });

    const latex = new sst.aws.Function("LatexApi", {
      python: {
        container: true,
      },
      handler: "latex/src/latex/api.handler",
      runtime: "python3.10",
      url: true,
      timeout: "5 minutes",
      memory: "2048 MB",
    });

    return {
      fastapi: fastapi.url,
      latex: latex.url,
    };
  },
});
