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
    });

    return {
      routerDomain: router.url,
      webDomain: web.url,
    };
  },
});
