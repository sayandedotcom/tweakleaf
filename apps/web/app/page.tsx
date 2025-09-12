import { HeroVideoDialogTopInBottomOutComponent } from "@/components/hero-video-dialog-top-in-bottom-out";
import { BentoGrid } from "@/components/kokonutui/bento-grid";
import TweetGridComponent from "@/components/tweet-grid-component";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, PartyPopper } from "lucide-react";
import Link from "next/link";
import { CompareUs } from "@/components/compare-us";
import { FounderTip } from "@/components/founder-tip";
import { RedditPosts } from "@/components/reddit-posts";
import { WordRotate } from "@/components/magicui/word-rotate";
import { Features } from "@/components/features";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center h-[85vh] pt-20"
        style={{
          background:
            "radial-gradient(circle at center, rgba(71, 255, 255, 0.04) 0%, rgba(17, 48, 61, 0.8) 30%, rgba(8, 25, 35, 0.9) 60%, var(--background) 100%)",
        }}
      >
        <div className="absolute top-20 z-20 flex items-center justify-center">
          <div
            className={cn(
              "group rounded-full border border-primary/20 text-base text-primary transition-all ease-in hover:cursor-pointer bg-primary/20 backdrop-blur-sm",
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out text-primary/80 duration-300">
              <PartyPopper className="mr-5 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              <span>Used by 1000+ job seekers</span>
            </AnimatedShinyText>
          </div>
        </div>
        <div className="relative mb-10">
          <span className="text-[4rem] flex flex-row gap-4 items-center justify-center font-extrabold text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.9)] animate-neon">
            Tweak
            <span className="px-2">
              <WordRotate words={["Resumes", "Cover Letters", "Cold Mails"]} />
            </span>
            with AI
          </span>
          <div className="text-[4rem] flex flex-row gap-4 items-center justify-center font-extrabold text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.9)]">
            For Free !
          </div>
          <div className="absolute inset-0 -z-10 bg-primary opacity-50 blur-[50px] animate-neon-glow" />
        </div>
        <p className="text-text text-center mt-4 max-w-7xl mx-auto">
          Apply to <u>100+ jobs</u> in just <u>10 minutes</u> less than{" "}
          <u>$0.50</u> with AI that&apos;s creates or tweaks cover letters and
          resumes in a <u>humanized</u> way to avoid <u>ATS detection</u> and
          achieve better rankings. All documents are generated in <u>LaTeX</u>{" "}
          for superior ATS compatibility, while our <u>proven prompts</u> ensure
          strong keyword usage for maximum impact.
          <br />
          <br />
          We reduce <u>hallucinations</u> and cut costs with advanced context
          engineering, and our AI agent mantains long term memory and
          continuously learn your preferences to make next document faster, more
          optimized, and more effective.
        </p>
        <div className="flex flex-row items-center justify-center gap-4">
          <Link
            href="/tweak"
            className={cn(
              buttonVariants(),
              "mt-6 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer text-lg px-8 py-3 rounded-xl shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105",
            )}
          >
            Start Tweaking <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <Features />
      <div className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-7">
          <div className="text-center max-w-5xl mx-auto">
            {/* <h2 className="mb-4 text-3xl">tl;dr</h2>
            <p className="text-xl text-muted-foreground mb-8 mx-auto leading-relaxed">
              Apply to hundreds of jobs in just 10 minutes for only $0.50 with
              AI that creates tailored cover letters and CVs written in a
              humanized way to avoid ATS detection and achieve better rankings.
              All documents are generated in LaTeX for superior ATS
              compatibility, while our proven prompts ensure strong keyword
              usage for maximum impact. We reduce hallucinations and cut costs
              with advanced context engineering, and our AI agents continuously
              learn your preferences to make every document faster, more
              optimized, and more effective.
            </p> */}
            <CompareUs />
            {/* Video Demo Section */}
            <div className="my-10" id="demo">
              <h2 className="text-muted-foreground mb-4 text-3xl">
                See how it works in 2 minutes
              </h2>
              <p className="text-base text-muted-foreground/80 mb-6 max-w-2xl mx-auto">
                Watch our quick demo to see how easy to apply to 100s of jobs in
                just an hours with tailored resumes and cover letters.
              </p>
              <div className="max-w-4xl mx-auto">
                <HeroVideoDialogTopInBottomOutComponent />
              </div>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto my-32">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  64,520+
                </div>
                <div className="text-muted-foreground">Blockchain Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  7,294+
                </div>
                <div className="text-muted-foreground">Web3 Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  100%
                </div>
                <div className="text-muted-foreground">Remote Ready</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        id="why-us"
      >
        <h2 className="text-3xl font-bold  mb-6 text-center">Why choose us?</h2>
        <p className="text-muted-foreground mb-6 text-center">
          We takes care of all uses pain points in job application process
          including costs, time, and effort.
        </p>
        {/* <Bento /> */}
        <BentoGrid />
      </div>
      <div className="relative z-10 container mx-auto pb-20" id="testimonials">
        <h2 className="text-3xl font-bold  mb-6 text-center">
          What our users say
        </h2>
        <p className="text-muted-foreground mb-6 text-center">
          Like hips uses don't lie.
        </p>
        <TweetGridComponent />
      </div>
      <FounderTip />
      <div
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        id="reddit"
      >
        <h2 className="text-3xl font-bold  mb-6 text-center">Special thanks</h2>
        <p className="text-muted-foreground mb-6 text-center">
          Reddit posts that helped us to shape and improve our product.
        </p>
        <RedditPosts />
        <div className="flex flex-col items-center justify-center mt-6">
          <span className="text-muted-foreground mb-6 text-center flex flex-row items-center justify-center gap-2">
            If you have any suggestions or feedback, please let us know
            <a href="http://x.com/sayandedotcom" className="text-primary">
              @sayandedotcom
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

{
  /* <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}
        id="pricing"
      >
        <PricingTable />
      </div> */
}

{
  /* <div style={{ width: "100%", height: "600px", position: "relative" }}>
  <Orb
    hoverIntensity={0.5}
    rotateOnHover={true}
    hue={0}
    forceHoverState={false}
  />
  <div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl text-foreground leading-tight text-center font-extrabold">
        Tweak CV & Cover Letters
        <span className="block">with AI agents</span>
      </h1>
      <div className="flex flex-row gap-4">
        <Link
          href="/tweak"
          className={cn(
            buttonVariants(),
            "mt-6 text-primary-foreground cursor-pointer text-lg",
          )}
        >
          Start Tweaking <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </div>
</div>; */
}
