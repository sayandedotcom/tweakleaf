import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-foreground">
              About Tweak.Jobs
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing job applications with AI-powered resume and cover
              letter optimization
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              At Tweak.Jobs, we believe that every job seeker deserves the
              opportunity to present their best self to potential employers. Our
              AI-powered platform helps you create compelling, tailored resumes
              and cover letters that stand out in today's competitive job
              market. We're committed to democratizing professional development
              tools, making career advancement accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* About Founder Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
              About the Founder
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Founder Image */}
              <div className="flex justify-center">
                <div className="relative">
                  <Image
                    src="/pic.jpeg"
                    alt="Founder of Tweak.Jobs"
                    width={300}
                    height={300}
                    className="rounded-xl shadow-lg object-cover w-[300px] h-[380px]"
                    priority
                  />
                </div>
              </div>

              {/* Founder Bio */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">
                  Hi, I'm Sayan
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  I'm a passionate developer and entrepreneur who believes in
                  the power of technology to solve real-world problems. With a
                  background in software development and a deep understanding of
                  the challenges job seekers face, I created Tweak.Jobs to
                  bridge the gap between traditional job application methods and
                  modern AI capabilities.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  My journey in tech has taught me that the best solutions come
                  from understanding user pain points and leveraging
                  cutting-edge technology to address them. Tweak.Jobs represents
                  my commitment to helping people achieve their career goals
                  through intelligent, user-friendly tools.
                </p>
                <div className="pt-4">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    Full-Stack Developer
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 ml-2">
                    AI Enthusiast
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1 ml-2">
                    Problem Solver
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How I Came to This Idea Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6">
              How I Came to This Idea
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The idea for Tweak.Jobs was born from my own experience and
                observations of friends struggling with job applications. I
                noticed that many talented individuals were being overlooked
                simply because their resumes didn't effectively communicate
                their value to potential employers.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                As AI technology advanced, I realized there was an opportunity
                to create a tool that could help job seekers optimize their
                applications while maintaining their authentic voice and
                personal brand. The challenge wasn't just about making resumes
                look better—it was about making them more effective at getting
                candidates noticed and hired.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tweak.Jobs is the result of countless hours of research,
                development, and testing. It's built on the principle that AI
                should enhance human creativity, not replace it, helping users
                craft compelling narratives that showcase their unique skills
                and experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-6">
              Tech Stack
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-8">
              Built with modern technologies for optimal performance and user
              experience
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Frontend */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                  Frontend
                </h4>
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    Next.js 14
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    React 18
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    TypeScript
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    Tailwind CSS
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    shadcn/ui
                  </Badge>
                </div>
              </div>

              {/* Backend */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                  Backend
                </h4>
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    Python FastAPI
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    PostgreSQL
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    Prisma ORM
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    Docker
                  </Badge>
                </div>
              </div>

              {/* AI & Tools */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                  AI & Tools
                </h4>
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    OpenAI GPT
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    LaTeX Compilation
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    PDF Generation
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center py-2"
                  >
                    Email Integration
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Job Applications?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of job seekers who are already using Tweak.Jobs to
            land their dream positions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Get Started Today
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
