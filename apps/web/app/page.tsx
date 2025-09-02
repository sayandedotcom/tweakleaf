// import { Bento } from "@/components/bento";
import { HeroVideoDialogTopInBottomOutComponent } from "@/components/hero-video-dialog-top-in-bottom-out";
import { BentoGrid } from "@/components/kokonutui/bento-grid";
import Orb from "@/components/reactbits/orb";
import TweetGridComponent from "@/components/tweet-grid-component";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CompareUs } from "@/components/compare-us";
import { FounderTip } from "@/components/founder-tip";
import { Waitlist } from "@clerk/nextjs";
import { RedditPosts } from "@/components/reddit-posts";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
        <div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Main Heading */}
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl text-foreground leading-tight text-center font-extrabold">
              Tweak CV & Cover Letters
              <span className="block">with self-learning AI agents</span>
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
              {/* <Button className="mt-6 rounded-full bg-primary text-primary-foreground cursor-pointer text-lg font-semibold">
                Pricing
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-center mt-10 mb-20" id="join-waitlist">
        <Waitlist />
      </div> */}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-7">
          <div className="text-center max-w-5xl mx-auto">
            {/* Subtitle */}
            <h2 className="mb-4 text-3xl">tl;dr</h2>
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
            </p>
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

      <div className="relative z-10 container mx-auto pb-20" id="testimonials">
        <h2 className="text-3xl font-bold  mb-6 text-center">
          What our users say
        </h2>
        <p className="text-muted-foreground mb-6 text-center">
          Like hips uses don't lie.
        </p>
        <TweetGridComponent />
      </div>
      {/* <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}
        id="pricing"
      >
        <PricingTable />
      </div> */}
      <FounderTip />
      {/* <div className="relative z-10 container mx-auto pb-20">
        <h2 className="text-3xl font-bold  mb-6 text-center">How it works</h2>
        <p className="text-muted-foreground mb-6 text-center">
          We are a team of experienced developers who are passionate about
          building tools that help people find their dream jobs. We are a team
          of experienced developers who are passionate about building tools that
          help people find their dream jobs.
        </p>
      </div> */}
      {/* Features Section */}
      {/* <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Smart Job Matching
            </h3>
            <p className="text-muted-foreground">
              AI-powered matching based on your skills, experience, and
              preferences.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Crypto Salary Insights
            </h3>
            <p className="text-muted-foreground">
              Transparent salary data and compensation insights for Web3 roles.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Global Community
            </h3>
            <p className="text-muted-foreground">
              Connect with Web3 professionals and companies worldwide.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
