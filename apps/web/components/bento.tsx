import {
  FileUser,
  CircleDollarSign,
  Bot,
  Brain,
  RemoveFormatting,
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { SkiperMarquee } from "./ui/skiper-marquee";

const features = [
  {
    Icon: Brain,
    name: "AI Support",
    description:
      "We use trained AI models to help you tweak your CV and cover letters.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: FileUser,
    name: "Tweak CV & Cover Letters with AI",
    description:
      "We use AI to help you tweak your CV and cover letters. according to your job application.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: CircleDollarSign,
    name: "Low cost",
    description: "You can use your own LLM API key to reduce costs.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: RemoveFormatting,
    name: "LaTex support",
    description: "Use LaTex to write your resume and cover letters.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Bot,
    name: "Multiple Models Support",
    description: "We support multiple models to choose from.",
    href: "/",
    cta: "Learn more",
    background: <SkiperMarquee />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function Bento() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}
