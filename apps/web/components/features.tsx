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
import GlassIcons from "./GlassIcons";

const features = [
  {
    title: "Time",
    description:
      "Just give job description and download resume / cover-letter in ~10 seconds.",
    icon: <Clock />,
    color: "glass",
  },
  {
    title: "LaTeX Support",
    description:
      "We use LaTeX to write your resume and cover letters, ensuring ATS compatibility.",
    icon: <RemoveFormatting />,
    color: "glass",
  },
  {
    title: "Humanized Text",
    description:
      "We generate content that is indistinguishable from human-written text, ensuring detectibility with ATS.",
    icon: <PersonStanding />,
    color: "glass",
  },
  {
    title: "ATS Optimization",
    description:
      "Our AI is designed to generate content that is aware of ATS, ensuring high rankings.",
    icon: <Trophy />,
    color: "glass",
  },
  {
    title: "Multiple Models",
    description:
      "We provide support for multiple models for your resume and cover letters.",
    icon: <Bot />,
    color: "glass",
  },
  {
    title: "Low Cost",
    description:
      "Our platfrom is free for you. You have to use your own API key.",
    icon: <DollarSign />,
    color: "glass",
  },
  {
    title: "Prompts",
    description:
      "We use prompts that are gathered from experts and different sources that are proven to be high ATS ranking.",
    icon: <SquareChevronRight />,
    color: "glass",
  },
  {
    title: "Memory",
    description:
      "We have long term memory to remember your context across all interactions.",
    icon: <Brain />,
    color: "glass",
  },
];

export function Features() {
  return (
    <div id="features" className="relative z-10 mx-auto px-4 pb-20 mt-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our features that make us different from the well established free
            AI chat models.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((feature) => (
          <SpotlightCard
            key={feature.title}
            className="custom-spotlight-card cursor-pointer"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <>
              <div className="flex justify-center items-center mb-4">
                <GlassIcons
                  items={[
                    {
                      icon: feature.icon,
                      color: feature.color,
                      label: feature.title,
                    },
                  ]}
                  className="!grid-cols-1 !gap-0 !py-0"
                />
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
