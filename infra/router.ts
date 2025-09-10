import { tweakApi, compilerApi } from "./api";
import { frontend } from "./frontend";

// Router
export const apiRouter = new sst.aws.Router("APIRouter", {
  domain: {
    name: "tweakapi.sayande.com",
    dns: false,
    cert: "arn:aws:acm:us-east-1:113025669772:certificate/c3f98b37-042b-4788-8e3f-5fabfe790997",
  },
  routes: {
    "/*": frontend.url,
    "/api/tweak/*": tweakApi.url,
    "/api/compiler/*": compilerApi.url,
  },
});
