import { site } from "@/configs/site";

export function Notifications() {
  return (
    <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border-b border-yellow-500/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center text-center">
          <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
            🚨 {site.notifications}, Proudly Open Source!{" "}
            <a
              href={site.links.github}
              className="text-yellow-600 dark:text-yellow-400 underline"
            >
              Link
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
