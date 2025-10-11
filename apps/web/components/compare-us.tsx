import { site } from "@/configs/site";
import SpotlightCard from "./SpotlightCard";

const comparisons = [
  {
    feature: "Time",
    others:
      "Every time you have to copy from chat and paste it in your document. It is not efficient & time consuming.",
    us: "Our main philosophy is to make applying to jobs fast and efficient. Give job description and download resume / cover-letter in ~10 seconds.",
  },
  {
    feature: "Prompts",
    others: "Your prompts may not be optimized for ATS.",
    us: "We use prompts that are gathered from experts and different sources that are proven to be high ATS ranking.",
    link: { text: "Check this.", href: "#reddit" },
  },
  {
    feature: "LaTeX Support",
    others:
      "They don't support LaTeX. So you have to copy & paste the content every time.",
    us: "We have our own LaTeX editor & compiler which supports professional LaTeX format, so you can download the content in LaTeX format.",
  },
  {
    feature: "ATS Compatibility",
    others: "Not aware of ATS.",
    us: "Our AI is designed to generate content that is aware of ATS.",
  },
  {
    feature: "AI Detectibility",
    others:
      "Unable to pass ATS that has detection mechanisms for human-written content & AI-generated content.",
    us: "Our AI is designed to generate content that is indistinguishable from human-written text, ensuring detectibility with ATS.",
  },
  {
    feature: "Hallucinations",
    others:
      "After 6-7 messages, the AI starts hallucinating. It forgets your preferences and context you provided in the long previous messages & what you have asked for.",
    us: "We use advanced self learning AI Agent that continuously learns from user provided context, stores it in long term memory and uses it to generate content.",
  },
  {
    feature: "Costs",
    others:
      "Most chat models provide free plans but once you have used the free plan, most of them degrade the models, so gradually the quality of the content decreases.",
    othersNote:
      "The pricing is too high & too much for just tweaking documents. Most models average base plans is around $20/month.",
    us: "We use advanced context-engineering techniques to reduce the usage of tokens & context window size and make it affordable for everyone.",
    usNote:
      "Basically our platform is completely free to use. You just have to pay for the API key for the models you use. For our estimated usage, we are charging $0.50 per 100 documents.",
  },
  {
    feature: "Models Variety",
    others:
      "To choose different models you have to switch between different websites, which is time consuming and inefficient.",
    us: "We have a wide variety of models to choose from. You can choose the model you want to use and we will use it to generate the content.",
    usNote:
      "Currently we are supporting OpenAI, Anthropic, Gemini, DeepSeek and cherry on top we also support any fine-tuned models from Hugging Face.",
  },
  {
    feature: "Long Term Memory",
    others:
      "Many AI chat models have short term memory. So they forget your instructions and context after a few messages or changing chat threads.",
    us: "We have our own long term memory that continuously learns from user provided context, stores it in long term memory and uses it to generate content.",
  },
];

export const CompareUs = () => {
  return (
    <>
      <section id="compare-us" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Compare Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Why choose us over the well established free AI chat models?
            </p>
          </div>

          <div className="w-full">
            {/* Header Row */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="p-6 bg-muted/20 border border-border rounded-tl-2xl">
                <h3 className="text-lg font-bold">Feature</h3>
              </div>
              <div className="p-6 bg-secondary/20 border border-l-0 border-border">
                <h3 className="text-lg font-bold text-muted-foreground">
                  AI Chat Models (Ex: ChatGPT)
                </h3>
              </div>
              <div className="p-6 bg-secondary/10 border border-l-0 border-border rounded-tr-2xl">
                <h3 className="text-lg font-bold text-primary">{site.name}</h3>
              </div>
            </div>

            {/* Comparison Rows */}
            {comparisons.map((item, index) => (
              <SpotlightCard
                key={index}
                className="border-t-0 rounded-none"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Feature Name */}
                  <div className="flex items-center justify-center p-6 border-0 rounded-none">
                    <h3 className="text-xl font-bold text-primary">
                      {item.feature}
                    </h3>
                  </div>

                  {/* AI Chat Models Column */}
                  <div className="space-y-3 p-6 border-0 rounded-none">
                    <p className="text-foreground/90 text-sm leading-relaxed">
                      {item.others}
                    </p>
                    {item.othersNote && (
                      <p className="text-xs text-muted-foreground italic leading-relaxed">
                        {item.othersNote}
                      </p>
                    )}
                  </div>

                  {/* Tweakleaf Column */}
                  <div className="space-y-3 p-6 border-0 rounded-none">
                    <p className="text-foreground text-sm leading-relaxed">
                      {item.us}
                    </p>
                    {item.usNote && (
                      <p className="text-xs text-muted-foreground italic leading-relaxed">
                        {item.usNote}
                      </p>
                    )}
                    {item.link && (
                      <a
                        href={item.link.href}
                        className="text-xs text-primary hover:underline inline-block"
                      >
                        {item.link.text}
                      </a>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
