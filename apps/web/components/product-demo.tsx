"use client";

import { YouTubePlayer } from "@/components/ui/youtube-video-player";

export function ProductDemoVideoPlayer() {
  return (
    <YouTubePlayer
      videoId="jNQXAC9IVRw"
      title="Watch Our Product Demo"
      customThumbnail="/dashboard-new.png"
      containerClassName="w-full h-full border-none shadow-none"
      thumbnailImageClassName="opacity-100 object-cover"
      playButtonClassName="h-20 w-20 md:h-24 md:w-24 bg-white/90 hover:bg-white border-2 border-primary/20 hover:border-primary/40 shadow-2xl"
      playIconClassName="text-primary fill-primary h-8 w-8 md:h-10 md:w-10"
      titleClassName="text-white font-semibold text-lg md:text-xl drop-shadow-lg"
      playerClassName="rounded-2xl"
    />
  );
}
