import { PricingCard } from "@/components/pricing-card";
import { plans } from "@/configs/plans";
import { site } from "@/configs/site";
import { Button } from "@/components/ui/button";

function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(133,213,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(133,213,255,0.08),transparent_50%)]"></div> */}

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {site.pricingPage.headerOne}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed">
              {site.pricingPage.headertwo}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="px-6 py-3 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                View Features
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        {/* <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-secondary/10 rounded-full blur-xl"></div> */}
      </div>

      {/* Pricing Cards Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              popular={plan.name === "Pro"}
            />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                How do credits work?
              </h3>
              <p className="text-muted-foreground">
                Each credit represents approximately 1,000 tokens that can be
                used for resume tweaking, cover letter generation, and other
                AI-powered features.
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Can I change plans anytime?
              </h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately and are prorated.
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                What's included in the free trial?
              </h3>
              <p className="text-muted-foreground">
                The free trial gives you 10 credits to test all features,
                including resume tweaking, cover letter generation, and job
                matching.
              </p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Is there a money-back guarantee?
              </h3>
              <p className="text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee. If you're not
                satisfied, we'll refund your subscription.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully used our
            AI-powered tools to improve their applications and get hired faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Start Your Free Trial
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
