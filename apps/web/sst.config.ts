// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "web",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
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
});
