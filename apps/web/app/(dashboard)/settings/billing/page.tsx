"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, CreditCard, DollarSign, Zap } from "lucide-react";
import { plans } from "@/configs/plans";

export default function BillingSettingsPage() {
  const [currentPlan, setCurrentPlan] = useState("Starter");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (planName: string) => {
    setIsLoading(true);
    // TODO: Implement plan upgrade logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrentPlan(planName);
    setIsLoading(false);
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Starter":
        return <Zap className="h-5 w-5" />;
      case "Pro":
        return <Crown className="h-5 w-5" />;
      case "BYO Key":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "Starter":
        return "bg-accent/20 border-accent/30";
      case "Pro":
        return "bg-primary/20 border-primary/30";
      case "BYO Key":
        return "bg-secondary/20 border-secondary/30";
      default:
        return "bg-muted/20 border-muted/30";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan and billing information.
        </p>
      </div>

      {/* Current Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-semibold text-foreground">
                {currentPlan}
              </h4>
              <p className="text-muted-foreground">
                {plans.find((p) => p.name === currentPlan)?.price === 5
                  ? "Unlimited usage with your own API keys"
                  : `$${plans.find((p) => p.name === currentPlan)?.price}/month`}
              </p>
              {currentPlan !== "BYO Key" && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg">🪙</span>
                  <span className="text-sm text-muted-foreground">
                    {currentPlan === "Starter"
                      ? "100 credits left"
                      : "300 credits left"}
                  </span>
                </div>
              )}
            </div>
            <Badge
              variant="secondary"
              className="text-secondary-foreground bg-secondary"
            >
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h4 className="text-lg font-medium mb-4">Available Plans</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.name;
            const isBYOKey = plan.name === "BYO Key";

            return (
              <Card
                key={plan.name}
                className={`relative ${getPlanColor(plan.name)} ${
                  isCurrentPlan ? "ring-2 ring-ring" : ""
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>
                    {isBYOKey ? (
                      <span className="text-lg font-semibold text-secondary-foreground">
                        ${plan.price}/month
                      </span>
                    ) : (
                      <span className="text-lg font-semibold text-primary">
                        ${plan.price}/month
                      </span>
                    )}
                  </CardDescription>
                  {!isBYOKey && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-lg">🪙</span>
                      <span className="text-sm text-muted-foreground">
                        {plan.name === "Starter"
                          ? "100 credits left"
                          : "300 credits left"}
                      </span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={isCurrentPlan || isLoading}
                    className={`w-full ${
                      isCurrentPlan
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                    size="sm"
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : isLoading
                        ? "Processing..."
                        : isBYOKey
                          ? "Switch to BYO Key"
                          : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Information
          </CardTitle>
          <CardDescription>
            Manage your payment method and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">
                    •••• •••• •••• 4242
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Next Billing Date</p>
                  <p className="text-sm text-muted-foreground">
                    March 15, 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
