import { DOMAINS } from "./domains";
import { router } from "./router";
import { secrets } from "./secrets";

export const web = new sst.aws.Nextjs("Web", {
  path: "apps/web",
  router: {
    instance: router,
    domain: DOMAINS.main,
  },
  link: [secrets],
});
