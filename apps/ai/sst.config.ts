/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  // App's config
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
  // App's resources
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
  // App's Console config
  console: {
    autodeploy: {
      target(event) {
        if (
          event.type === "branch" &&
          event.branch === "main" &&
          event.action === "pushed"
        ) {
          return { stage: "main" };
        }
      },
      runner(input) {
        // Optimized settings for main/production
        if (input.stage === "main") {
          return {
            engine: "codebuild",
            timeout: "45 minutes", // Python builds can be slower with dependencies
            cache: {
              paths: [
                // UV specific caches
                ".venv", // Virtual environment
                "uv.lock", // UV lock file
                ".uv-cache", // UV global cache

                // Python caches
                "__pycache__", // Python bytecode cache
                ".pytest_cache", // Pytest cache
                ".mypy_cache", // MyPy type checker cache

                // Workspace structure (UV)
                "apps/ai/.venv", // App-specific virtual env
                "apps/*/pyproject.toml", // Project configs

                // Dependencies and build artifacts
                "dist", // Built packages
                "build", // Build directory
                "*.egg-info", // Package info

                // AI/ML specific caches (if applicable)
                ".cache/huggingface", // Hugging Face model cache
                ".cache/torch", // PyTorch cache
                "models", // Local model storage
              ],
            },
          };
        }

        // Default settings for development stages
        return {
          engine: "codebuild",
          timeout: "25 minutes",
          cache: {
            paths: [
              ".venv",
              "uv.lock",
              ".uv-cache",
              "__pycache__",
              "apps/ai/.venv",
            ],
          },
        };
      },
    },
  },
});
