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
    // Domains
    const DOMAINS = {
      main: "api.tweakleaf.com",
      tweakRouter: "/tweak/*",
      compilerRouter: "/compiler/*",
    };

    // Lambda function for tweak
    const tweakApi = new sst.aws.Function("TweakLambdaFunction", {
      description: "Handler function for tweak api.",
      handler: "tweak/src/tweak/api.handler",
      runtime: "python3.10",
      url: {
        cors: false,
      },
      timeout: "60 seconds",
      environment: {
        SUPABASE_URL: process.env.SUPABASE_URL ?? "",
        SUPABASE_KEY: process.env.SUPABASE_KEY ?? "",
      },
    });

    // Lambda function for compiler
    const compilerApi = new sst.aws.Function("CompilerLambdaFunction", {
      description: "Handler function for compiler api.",
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
        name: DOMAINS.main,
      },
      routes: {
        [DOMAINS.tweakRouter]: tweakApi.url,
        [DOMAINS.compilerRouter]: compilerApi.url,
      },
    });

    return {
      apiDomain: apiRouter.url,
      tweakDomain: tweakApi.url,
    };
  },
});
