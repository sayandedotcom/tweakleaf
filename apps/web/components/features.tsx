"use client";

import {
  Bot,
  PersonStanding,
  RemoveFormatting,
  DollarSign,
  Clock,
  SquareChevronRight,
  Brain,
  Trophy,
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";

const features = [
  {
    title: "Time",
    description:
      "Just give job description and download resume / cover-letter in ~10 seconds.",
    icon: <Clock />,
  },
  {
    title: "LaTeX Support",
    description:
      "We use LaTeX to write your resume and cover letters, ensuring ATS compatibility.",
    icon: <RemoveFormatting />,
  },
  {
    title: "Humanized Text",
    description:
      "We generate content that is indistinguishable from human-written text, ensuring detectibility with ATS.",
    icon: <PersonStanding />,
  },
  {
    title: "ATS Optimization",
    description:
      "Our AI is designed to generate content that is aware of ATS, ensuring high rankings.",
    icon: <Trophy />,
  },
  {
    title: "Multiple Models",
    description:
      "We provide support for multiple models for your resume and cover letters.",
    icon: <Bot />,
  },
  {
    title: "Low Cost",
    description:
      "Our platfrom is free for you. You have to use your own API key.",
    icon: <DollarSign />,
  },
  {
    title: "Prompts",
    description:
      "We use prompts that are gathered from experts and different sources that are proven to be high ATS ranking.",
    icon: <SquareChevronRight />,
  },
  {
    title: "Memory",
    description:
      "We have long term memory to remember your context across all interactions.",
    icon: <Brain />,
  },
];

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200">
      <div className="w-12 h-12 mb-4 bg-primary/20 rounded-md flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export function Features() {
  return (
    <div className="relative z-10 mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((feature) => (
          <SpotlightCard
            key={feature.title}
            className="custom-spotlight-card cursor-pointer"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <>
              <div className="w-12 h-12 mb-4 bg-primary/20 rounded-md flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
