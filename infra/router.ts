import { DOMAINS } from "./domains";

// Router
export const router = new sst.aws.Router("Router", {
  domain: {
    name: DOMAINS.main,
  },
});
