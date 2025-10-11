import { BentoGrid } from "@/components/kokonutui/bento-grid";
import TweetGridComponent from "@/components/tweet-grid-component";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, PartyPopper } from "lucide-react";
import { CompareUs } from "@/components/compare-us";
import { FounderTip } from "@/components/founder-tip";
import { RedditPosts } from "@/components/reddit-posts";
import { WordRotate } from "@/components/magicui/word-rotate";
import { Features } from "@/components/features";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ShinyButton } from "@/components/magicui/shiny-button";
// import { ContainerScrollComponent } from "@/components/container-scroll-component";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Prism from "@/components/Prism";
import { Suspense } from "react";
import { Loader } from "@/components/loader";
import LaserFlowDashboard from "@/components/laser-flow-dashboard";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <div style={{ width: "100%", height: "600px", position: "relative" }}>
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
          />
          <div className="mb-10 absolute inset-0 top-20 z-10 flex flex-col items-center justify-center">
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
            <Badge variant="outline" className="animate-appear text-sm">
              <span className="text-muted-foreground">
                Want to use Tweakleaf for free?
              </span>
              <Link href="/blogs/free" className="flex items-center gap-1">
                Read more
                <ArrowRight className="size-3" />
              </Link>
            </Badge>
            <span className="text-[4rem] flex flex-row gap-4 items-center justify-center font-extrabold text-primary">
              Tweak LaTeX
              <span className="px-2.5 w-[34rem]">
                <WordRotate words={["Resumes/CVs", "Cover Letters"]} />
              </span>
            </span>
            <div className="text-[4rem] flex flex-row gap-4 items-center justify-center font-extrabold text-primary">
              with AI agents
            </div>
          </div>
        </div>
      </Suspense>
      <Suspense fallback={<Loader />}>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-7">
          <p className="text-center mt-4 max-w-7xl mx-auto">
            Apply to <u>100+ jobs</u> in just <u>10 minutes</u> for{" "}
            <u>
              free ( <a href="/blogs/free">click here</a> )
            </u>{" "}
            with AI that&apos;s creates or tweaks cover letters and resumes in
            optimized with accurate keywords and <u>humanized</u> the content to
            avoid <u>ATS&apos;s AI detection</u> and improve your document
            rankings. All documents are generated in <u>LaTeX</u> for superior
            ATS compatibility, while our <u>proven prompts</u> ensure strong
            keyword usage for maximum impact.
            <br />
            <br />
            We use multiple strong and weak LLM models to create or tweak your
            documents to make every document unique and reduce{" "}
            <u>hallucinations</u> and cut costs with advanced context
            engineering, and our AI agent mantains long term memory and
            continuously learn your preferences to make next document faster,
            more optimized, and more effective.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <ShinyButton
              href="/tweak"
              className={cn(
                buttonVariants(),
                "mt-6 bg-primary font-bold hover:bg-primary/90 text-primary-foreground cursor-pointer text-lg rounded-xl shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105",
              )}
            >
              Start Tweaking
            </ShinyButton>
          </div>
        </div>
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Features />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <LaserFlowDashboard />
      </Suspense>
      {/* <Suspense fallback={<Loader />}>
        <ContainerScrollComponent />
      </Suspense> */}
      <Suspense fallback={<Loader />}>
        <div className="relative overflow-hidden">
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-7">
            <div className="text-center max-w-5xl mx-auto">
              <CompareUs />
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
      </Suspense>
      <Suspense fallback={<Loader />}>
        <div
          className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
          id="why-us"
        >
          <h2 className="text-3xl font-bold  mb-6 text-center">
            Why choose us?
          </h2>
          <p className="text-muted-foreground mb-6 text-center">
            We takes care of all uses pain points in job application process
            including costs, time, and effort.
          </p>
          {/* <Bento /> */}
          <BentoGrid />
        </div>
      </Suspense>
      <Suspense fallback={<Loader />}>
        <div
          className="relative z-10 container mx-auto pb-20"
          id="testimonials"
        >
          <h2 className="text-3xl font-bold  mb-6 text-center">
            What our users say
          </h2>
          <p className="text-muted-foreground mb-6 text-center">
            Like hips uses don't lie.
          </p>
          <TweetGridComponent />
        </div>
      </Suspense>
      <Suspense fallback={<Loader />}>
        <FounderTip />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <div
          className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20"
          id="reddit"
        >
          <h2 className="text-3xl font-bold  mb-6 text-center">
            Special thanks
          </h2>
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
      </Suspense>
    </div>
  );
}

// <div
//   className="relative flex flex-col items-center justify-center h-[85vh] pt-20"
//   style={{
//     background:
//       "radial-gradient(circle at center, rgba(17, 48, 61, 0.8) 30%, rgba(8, 25, 35, 0.9) 60%, var(--background) 100%)",
//   }}
//   // rgba(71, 255, 255, 0.04) 0%,
// >
//   <div className="absolute top-20 z-20 flex items-center justify-center">
//     <div
//       className={cn(
//         "group rounded-full border border-primary/20 text-base text-primary transition-all ease-in hover:cursor-pointer bg-primary/20 backdrop-blur-sm",
//       )}
//     >
//       <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out text-primary/80 duration-300">
//         <PartyPopper className="mr-5 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
//         <span>Used by 1000+ job seekers</span>
//       </AnimatedShinyText>
//     </div>
//   </div>
//   <Badge variant="outline" className="animate-appear text-sm">
//     <span className="text-muted-foreground">
//       Want to use Tweakleaf for free?
//     </span>
//     <Link href="/blogs/free" className="flex items-center gap-1">
//       Read more
//       <ArrowRight className="size-3" />
//     </Link>
//   </Badge>
//   <div className="relative mb-10">
//     <span className="text-[4rem] flex flex-row gap-4 items-center justify-center font-extrabold text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.9)] animate-neon">
//       Tweak LaTeX
//       <span className="px-2.5 w-[34rem]">
//         <WordRotate words={["Resumes/CVs", "Cover Letter"]} />
//       </span>
//     </span>
//     <div className="text-[4rem] flex flex-row gap-4 items-center justify-center font-extrabold text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.9)]">
//       with AI agents
//     </div>
//     <div className="absolute inset-0 -z-10 bg-primary opacity-50 blur-[50px] animate-neon-glow" />
//   </div>
//   <p className="text-text text-center mt-4 max-w-7xl mx-auto">
//     Apply to <u>100+ jobs</u> in just <u>10 minutes</u> for{" "}
//     <u>
//       free ( <a href="/blogs/free">click here</a> )
//     </u>{" "}
//     with AI that&apos;s creates or tweaks cover letters and resumes in
//     optimized with accurate keywords and <u>humanized</u> the content to
//     avoid <u>ATS&apos;s AI detection</u> and improve your document
//     rankings. All documents are generated in <u>LaTeX</u> for superior ATS
//     compatibility, while our <u>proven prompts</u> ensure strong keyword
//     usage for maximum impact.
//     <br />
//     <br />
//     We use multiple strong and weak LLM models to create or tweak your
//     documents to make every document unique and reduce{" "}
//     <u>hallucinations</u> and cut costs with advanced context engineering,
//     and our AI agent mantains long term memory and continuously learn your
//     preferences to make next document faster, more optimized, and more
//     effective.
//   </p>
//   {/* <div className="flex flex-row items-center justify-center gap-4">
//     <Link
//       href="/tweak"
//       className={cn(
//         buttonVariants(),
//         "mt-6 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer text-lg px-8 py-3 rounded-xl shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105",
//       )}
//     >
//       Start Tweaking <ArrowRight className="w-4 h-4" />
//     </Link>
//   </div> */}
//   <div className="flex flex-row items-center justify-center gap-4">
//     <ShinyButton
//       href="/tweak"
//       className={cn(
//         buttonVariants(),
//         "mt-6 bg-primary font-bold hover:bg-primary/90 text-primary-foreground cursor-pointer text-lg rounded-xl shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105",
//       )}
//     >
//       Start Tweaking
//     </ShinyButton>
//   </div>
// </div>;
