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
                  Free AI Chat Models ( Ex: ChatGPT)
                </th>
                <th className="px-6 py-4 font-semibold text-center">
                  {site.name}
                </th>
              </tr>
            </thead>
            <tbody className="text-white">
              <tr className="border-t border-border">
                <td className="px-6 py-4">Time</td>
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
                <td className="px-6 py-4">Hallucinations</td>
                <td className="bg-muted px-6 py-4">
                  After 6-7 messages, the AI starts hallucinating. It forgets
                  what you have asked for.
                </td>
                <td className="px-6 py-4">
                  We use advanced self learning AI Agent that continuously
                  learns from user provided context.
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4">Context Engineering</td>
                <td className="bg-muted px-6 py-4">
                  After long time, they are not aware of your preferences and
                  context you provided in the long previous messages.
                </td>
                <td className="px-6 py-4">
                  We use advanced context engineering to make AI agents to learn
                  about your preferences and continuously remove irrelevant
                  context to decrease context window size.
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4">LaTex Support</td>
                <td className="bg-muted px-6 py-4">
                  They don&apos;t support LaTex.
                </td>
                <td className="px-6 py-4">We support LaTex.</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-6 py-4">Cost</td>
                <td className="bg-muted px-6 py-4">
                  We are a startup and we are trying to make it affordable for
                  everyone.
                </td>
                <td className="px-6 py-4">
                  They are not aware of your preferences and context.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
