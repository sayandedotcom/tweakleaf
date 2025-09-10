import { site } from "@/configs/site";

export const CompareUs = () => {
  return (
    <section id="compare-us" className="py-10">
      <div className="container">
        <h2 className="mb-4 text-center text-4xl font-semibold">Compare Us</h2>
        <p className="mb-8 text-center text-muted-foreground">
          Why to choose us over the well established free AI chat models?
        </p>
        <div className="mx-auto max-w-5xl overflow-x-auto">
          <table className="rounded border text-left shadow-lg">
            <thead>
              <tr>
                <th></th>
                <th className="bg-muted px-6 py-4 font-semibold text-center">
                  AI Chat Models ( Ex: ChatGPT)
                </th>
                <th className="px-6 py-4 font-semibold text-center">
                  {site.name}
                </th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr className="border-t border-border">
                <td className="px-6 py-4 text-center">Time</td>
                <td className="bg-muted px-6 py-4">
                  Every time you have to copy from chat and paste the in your
                  document. It is not efficient & time consuming.
                </td>
                <td className="px-6 py-4">
                  Our main philosophy is to make applying to jobs fast and
                  efficient. Give job description and download resume /
                  cover-letter in ~10 seconds.
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4 text-center">Prompts</td>
                <td className="bg-muted px-6 py-4">
                  Your prompts may be not be optimized for ATS.
                </td>
                <td className="px-6 py-4">
                  We use prompts that are gathered from experts and different
                  sources that are proven to be high ATS ranking.
                  <br />
                  <a href="#reddit" className="text-sm text-muted-foreground">
                    Check this.
                  </a>
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4 text-center">LaTex Support</td>
                <td className="bg-muted px-6 py-4">
                  They don&apos;t support LaTex. So you have to copy & paste the
                  content every time.
                </td>
                <td className="px-6 py-4">
                  We have our own LaTex editor & compiler which supports
                  professional LaTex format, so you can download the content in
                  LaTex format.
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  ATS Compatibility
                </td>
                <td className="bg-muted px-6 py-4">Not aware of ATS.</td>
                <td className="px-6 py-4">
                  Our AI is designed to generate content that is aware of ATS.
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4 text-center">AI Detectibility</td>
                <td className="bg-muted px-6 py-4">
                  Unable to pass ATS that has detection mechanisms for
                  human-written content & AI-generated content.
                </td>
                <td className="px-6 py-4">
                  Our AI is designed to generate content that is
                  indistinguishable from human-written text, ensuring
                  detectibility with ATS.
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4 text-center">Hallucinations</td>
                <td className="bg-muted px-6 py-4">
                  After 6-7 messages, the AI starts hallucinating. It forgets
                  your preferences and context you provided in the long previous
                  messages & what you have asked for.
                </td>
                <td className="px-6 py-4">
                  We use advanced self learning AI Agent that continuously
                  learns from user provided context, stores it in long term
                  memory and uses it to generate content.
                </td>
              </tr>
              {/* <tr className="border-t border-border">
                <td className="px-6 py-4">Context Engineering</td>
                <td className="bg-muted px-6 py-4">
                  After long time, they are not aware of your preferences and
                  context you provided in the long previous messages &
                  instructions.
                </td>
                <td className="px-6 py-4">
                  We use advanced context engineering to make AI agents to learn
                  about your preferences and continuously remove irrelevant
                  context to decrease context window size.
                </td>
              </tr> */}
              <tr className="border-t border-border">
                <td className="px-6 py-4 text-center">Costs</td>
                <td className="bg-muted px-6 py-4">
                  Most chat models provide free plans but once you have used the
                  free plan, most of them degrade the models, so gradually the
                  quality of the content decreases.
                  <br />
                  <br />
                  <span className="text-sm text-muted-foreground">
                    The pricing is too high & too much for just tweaking
                    documents. Most models average base plans is around
                    $20/month.
                  </span>
                </td>
                <td className="px-6 py-4">
                  We use advanced context-engineering techniques to reduce the
                  usage of tokens & context window size and make it affordable
                  for everyone.
                  <br />
                  <br />
                  <span className="text-sm text-muted-foreground">
                    Basically our platform is completely free to use. You just
                    have to pay for the API key for the models you use. For our
                    estimated usage, we are charging $0.50 per 100 documents.
                  </span>
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4 text-center">Models variety</td>
                <td className="bg-muted px-6 py-4">
                  To choose different models you have to switch between
                  different websites, which is time consuming and inefficient.
                </td>
                <td className="px-6 py-4">
                  We have a wide variety of models to choose from. You can
                  choose the model you want to use and we will use it to
                  generate the content.
                  <br />
                  <br />
                  <span className="text-sm text-muted-foreground">
                    Currently we are supporting OpenAI, Anthropic, Gemini,
                    DeepSeek and cherry on top we also support any fine-tuned
                    models from Hugging Face.
                  </span>
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4 text-center">Long Term Memory</td>
                <td className="bg-muted px-6 py-4">
                  Many AI chat models have short term memory. So they forget
                  your instructions and context after a few messages or changing
                  chat threads.
                </td>
                <td className="px-6 py-4">
                  We have our own long term memory that continuously learns from
                  user provided context, stores it in long term memory and uses
                  it to generate content.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
