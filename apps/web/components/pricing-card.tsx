import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PricingCardProps {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export function PricingCard({
  name,
  price,
  features,
  popular = false,
}: PricingCardProps) {
  return (
    <Card
      className={`w-full max-w-sm relative p-3 ${popular ? "ring-2 ring-primary shadow-lg" : ""}`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl mb-3">{name}</CardTitle>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <CardDescription className="mb-4">
          Perfect for {name.toLowerCase()} users
        </CardDescription>
        <CardAction>
          <Button variant="link" className="p-0 h-auto">
            Learn More
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-muted-foreground leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <Button className="w-full py-3">Get Started</Button>
      </CardFooter>
    </Card>
  );
}
