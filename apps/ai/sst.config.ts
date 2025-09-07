/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "ai",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    // Lambda tweak function
    const tweakApi = new sst.aws.Function("TweakAPIFunction", {
      handler: "tweak/src/tweak/api.handler",
      runtime: "python3.10",
      url: {
        cors: false,
      },
    });

    // Lambda compiler function
    const compilerApi = new sst.aws.Function("CompilerAPIFunction", {
      python: {
        container: true,
      },
      handler: "compiler/src/compiler/api.handler",
      runtime: "python3.10",
      url: {
        cors: false,
      },
    });

    // Router
    const apiRouter = new sst.aws.Router("APIRouter", {
      domain: {
        name: "tweakapi.sayande.com",
        dns: false,
        cert: "arn:aws:acm:us-east-1:113025669772:certificate/c3f98b37-042b-4788-8e3f-5fabfe790997",
      },
      routes: {
        "/tweak/*": tweakApi.url,
        "/compiler/*": compilerApi.url,
      },
    });

    return {
      apiDomain: apiRouter.url,
      tweakDomain: tweakApi.url,
      compilerDomain: compilerApi.url,
    };
  },
});
