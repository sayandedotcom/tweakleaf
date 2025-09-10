export const frontend = new sst.aws.Nextjs("Frontend", {
  path: "apps/web",
  environment: {
    NEXT_PUBLIC_API_URL: "https://tweakapi.sayande.com",
  },
});
