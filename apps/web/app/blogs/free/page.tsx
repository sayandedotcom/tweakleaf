import Image from "next/image";
import { CheckCircle, Key, ExternalLink } from "lucide-react";

function FreePage() {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
            How to use Tweakleaf for free forever!
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded mb-8"></div>
        </div>

        {/* Introduction Section */}
        <div className="bg-card border border-border rounded p-8 mb-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-secondary rounded">
              <Key className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Important Note
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You&apos;ll need to use your own API key to use this platform.
                We currently support two model options:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 bg-destructive/10 border border-destructive rounded">
              <h3 className="font-semibold text-destructive mb-2">OpenAI</h3>
              <p className="text-sm text-destructive-foreground">
                No free tier available
              </p>
            </div>
            <div className="p-6 bg-accent border border-border rounded">
              <h3 className="font-semibold text-accent-foreground mb-2">
                Gemini
              </h3>
              <p className="text-sm text-accent-foreground">
                Free tier with generous limits
              </p>
            </div>
          </div>

          <div className="bg-muted p-6 rounded border border-border">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-foreground mt-1 flex-shrink-0" />
              <div>
                <p className="text-foreground font-medium mb-2">
                  Advantages to use this platform and why you will never hit
                  rate limits:
                </p>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• You can generate up to 5 documents per minute</li>
                  <li>• We use advanced prompt compression for efficiency</li>
                  <li>
                    • We use smart LLM routing with strong and weak models
                  </li>
                  <li>• We use optimized context engineering</li>
                  <li>• We never hit rate limits with our optimizations</li>
                  <li>• We are using AWS credits to power this platform</li>
                  <li>
                    • Average time to generate a document is around 20 sec for
                    initial generation and around 5 seconds for subsequent
                    generations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="space-y-16 mx-auto">
          {/* Step 1 */}
          <div className="bg-card border border-border rounded p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded font-bold text-lg">
                1
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Create Your Account
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Sign up for free using your email or Google account. It&apos;s
              quick and easy!
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card border border-border rounded p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded font-bold text-lg">
                2
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Access Configuration
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Click on the configure button to access your settings panel.
            </p>
            <Image
              src="/step-2.png"
              alt="Configure button screenshot"
              width={1400}
              height={1400}
              className="w-full h-auto max-w-7xl mx-auto"
              priority
            />
          </div>

          {/* Step 3 */}
          <div className="bg-card border border-border rounded p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded font-bold text-lg">
                3
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Generate API Key
              </h2>
            </div>
            <div className="mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Navigate to Google AI Studio and generate your free API key:
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Google AI Studio
              </a>
            </div>
            <Image
              src="/step-3.png"
              alt="Google AI Studio API key generation"
              width={1400}
              height={1400}
              className="w-full h-auto max-w-7xl mx-auto"
              priority
            />
          </div>

          {/* Step 4 */}
          <div className="bg-card border border-border rounded p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded font-bold text-lg">
                4
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Configure Your API Key
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Paste the API key you generated into the API key field in your
              Tweakleaf configuration.
            </p>
            <Image
              src="/step-4.png"
              alt="API key configuration"
              width={1400}
              height={1400}
              className="w-full h-auto max-w-7xl mx-auto"
              priority
            />
          </div>

          {/* Completion Step */}
          <div className="bg-accent border border-border rounded p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-foreground text-background rounded">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-accent-foreground">
                You&apos;re All Set!
              </h2>
            </div>
            <p className="text-accent-foreground text-lg leading-relaxed mb-4">
              Congratulations! You can now use Tweakleaf completely free with
              your Gemini API key.
            </p>
            <div className="bg-card p-6 rounded border border-border">
              <h3 className="font-semibold text-foreground mb-3">
                What&apos;s Next?
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-foreground flex-shrink-0" />
                  Start creating professional resumes and cover letters
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-foreground flex-shrink-0" />
                  Generate up to 5 documents per minute
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-foreground flex-shrink-0" />
                  Enjoy unlimited usage with no rate limits
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-center">
          Need any help? DM me on twitter / x at{" "}
          <a href="https://x.com/sayandedotcom">sayandedotcom</a>
        </p>
      </div>
    </section>
  );
}

export default FreePage;
