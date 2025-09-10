// Lambda tweak function
export const tweakApi = new sst.aws.Function("TweakAPIFunction", {
  handler: "apps/ai/tweak/src/tweak/api.handler",
  runtime: "python3.10",
  url: {
    cors: false,
  },
});

// Lambda compiler function
export const compilerApi = new sst.aws.Function("CompilerAPIFunction", {
  python: {
    container: true,
  },
  handler: "apps/ai/compiler/src/compiler/api.handler",
  runtime: "python3.10",
  url: {
    cors: false,
  },
});
