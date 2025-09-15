import { DOMAINS } from "./domains";
import { router } from "./router";
import { secrets } from "./secrets";

// Lambda function for tweak
export const tweakApi = new sst.aws.Function("TweakLambdaFunction", {
  description: "Handler function for tweak api.",
  handler: "apps/ai/tweak/src/tweak/api.handler",
  runtime: "python3.10",
  url: {
    cors: false,
    router: {
      instance: router,
      path: DOMAINS.tweakRouter,
    },
  },
  link: [secrets],
});

// Lambda function for compiler
export const compilerApi = new sst.aws.Function("CompilerLambdaFunction", {
  description: "Handler function for compiler api.",
  python: {
    container: true,
  },
  handler: "apps/ai/compiler/src/compiler/api.handler",
  runtime: "python3.10",
  url: {
    cors: false,
    router: {
      instance: router,
      path: DOMAINS.compilerRouter,
    },
  },
  link: [secrets],
});
