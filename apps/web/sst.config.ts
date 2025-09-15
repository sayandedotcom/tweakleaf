// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  // App's config
  app(input) {
    return {
      name: "web",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  // App's resources
  async run() {
    // Domain
    const DOMAIN = {
      main: "tweakleaf.com",
      api: "api.tweakleaf.com",
    };

    // Router
    const router = new sst.aws.Router("Router", {
      domain: {
        name: DOMAIN.main,
      },
    });

    // Web
    const web = new sst.aws.Nextjs("Web", {
      router: {
        instance: router,
        domain: DOMAIN.main,
      },
      environment: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
          process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
        NEXT_PUBLIC_CLERK_SIGN_IN_URL:
          process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "",
        NEXT_PUBLIC_CLERK_SIGN_UP_URL:
          process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "",
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
      },
    });

    return {
      routerDomain: router.url,
      webDomain: web.url,
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
            engine: "codebuild", // Required property
            timeout: "60 minutes", // Longer timeout for monorepo builds
            cache: {
              paths: [
                // pnpm specific caches
                "node_modules",
                ".pnpm-store",
                "pnpm-lock.yaml",

                // Turborepo cache
                ".turbo",
                "node_modules/.cache/turbo",

                // Next.js cache
                ".next/cache",
                "apps/web/.next/cache",

                // Workspace node_modules (monorepo packages)
                "apps/*/node_modules",
                "packages/*/node_modules",

                // Package build outputs (if you build packages)
                "packages/*/dist",
                "packages/*/build",
              ],
            },
          };
        }
        // Default settings for development stages
        return {
          engine: "codebuild", // Required property
          timeout: "30 minutes", // Increased for monorepo
          cache: {
            paths: [
              "node_modules",
              ".pnpm-store",
              ".turbo",
              ".next/cache",
              "apps/web/.next/cache",
            ],
          },
        };
      },
    },
  },
});
