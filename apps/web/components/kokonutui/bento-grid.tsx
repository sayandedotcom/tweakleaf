"use client";

import Anthropic from "@/components/kokonutui/anthropic";
import AnthropicDark from "@/components/kokonutui/anthropic-dark";
import Google from "@/components/kokonutui/gemini";
import OpenAI from "@/components/kokonutui/open-ai";
import OpenAIDark from "@/components/kokonutui/open-ai-dark";
import MistralAI from "@/components/kokonutui/mistral";
import DeepSeek from "@/components/kokonutui/deepseek";
import { cn } from "@/lib/utils";
import {
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Key,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Badge } from "../ui/badge";

interface BentoItem {
  id: string;
  title: string;
  description: string;
  icons?: boolean;
  href?: string;
  feature?:
    | "chart"
    | "counter"
    | "code"
    | "timeline"
    | "spotlight"
    | "icons"
    | "typing"
    | "metrics";
  spotlightItems?: string[];
  timeline?: Array<{ year: string; event: string }>;
  code?: string;
  codeLang?: string;
  typingText?: string;
  metrics?: Array<{
    label: string;
    value: number;
    suffix?: string;
    color?: string;
  }>;
  statistic?: {
    value: string;
    label: string;
    start?: number;
    end?: number;
    suffix?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const bentoItems: BentoItem[] = [
  {
    id: "main",
    title: "Service we offer",
    description:
      "We offer a wide range of services to help you with your job application, including resume writing, cover letter writing, and more.",
    href: "#",
    feature: "spotlight",
    spotlightItems: [
      "Resume Writing",
      "Cover Letter Writing",
      "Cold Email Writing",
      "Humanizing texts",
      "ATS optimized",
      "LaTex Support",
    ],
    size: "lg",
    className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1",
  },
  {
    id: "stat1",
    title: "Self-learning AI Agents",
    description:
      "Our AI agents are designed to learn, adapt, to tailor your resume or cover letter.",
    href: "",
    feature: "typing",
    // typingText:
    //   "const createAgent = async () => {\n  const agent = new AIAgent({\n    model: 'gpt-4-turbo',\n    tools: [codeAnalysis, dataProcessing],\n    memory: new ConversationalMemory()\n  });\n\n  // Train on domain knowledge\n  await agent.learn(domainData);\n\n  return agent;\n};",
    typingText:
      "\\documentclass[]{cover}\n" +
      "\\usepackage{fancyhdr}\n" +
      "\n" +
      "\\pagestyle{fancy}\n" +
      "\\fancyhf{}\n" +
      "\n" +
      "\\rfoot{Page \\thepage \\hspace{1pt}}\n" +
      "\\thispagestyle{empty}\n" +
      "\\renewcommand{\\headrulewidth}{0pt}\n" +
      "\\begin{document}\n" +
      "\n" +
      "\\namesection{John}{Doe}{ \\urlstyle{same}\\href{https://johndoe.xyz}{johndoe.xyz} | \\href{mailto:me@johndoe.xyz}{me@johndoe.xyz} | 07771238921 | \\urlstyle{same}\\href{https://github.com}{Github} | \\urlstyle{same}\\href{https://linkedin.com}{Linkedin}}\n" +
      "\n" +
      "\\hfill\n" +
      "\n" +
      "\\begin{minipage}[t]{0.5\\textwidth} \n" +
      "\\companyname{Random LLC}\n" +
      "\\companyaddress{\n" +
      "24 Hours \\\\\n" +
      "Keep Grinding \\\\\n" +
      "Leetcode\n" +
      "}\n" +
      "\n" +
      "\\end{minipage}\n" +
      "\\begin{minipage}[t]{0.49\\textwidth} \n" +
      "\\currentdate{\\today}\n" +
      "\\end{minipage}\n" +
      "\n" +
      "\\lettercontent{Dear Recruiter,}\n" +
      "\n" +
      "\\lettercontent{Praesent non elementum enim, id aliquet risus. Morbi sit amet urna condimentum, pulvinar lacus sit amet, accumsan lectus. Morbi facilisis mauris ut turpis tincidunt, vel convallis nibh placerat.}\n" +
      "\\vspace{0.5cm}\n" +
      "\n" +
      "\\closing{Sincerely,\\\\ \n" +
      "\\vspace{.1cm} \n" +
      "\\includegraphics[width=4cm]{signature} \n" +
      "\\vspace{-1cm} }\n" +
      "\n" +
      "\\signature{John Doe}\n" +
      "\n" +
      "\\end{document}\n" +
      "\\documentclass[]{article}\n",
    size: "md",
    className: "col-span-2 row-span-1 col-start-1 col-end-3",
  },
  {
    id: "partners",
    title: "Choose your model",
    description:
      "We offer a wide range of models to choose from, including OpenAI, Anthropic, Google, and more.",
    icons: true,
    href: "#",
    feature: "icons",
    size: "md",
    className: "col-span-1 row-span-1",
  },
  {
    id: "innovation",
    title: "Innovation timeline",
    description:
      "Pioneering the future of AI and cloud computing with breakthrough innovations",
    href: "#",
    feature: "timeline",
    timeline: [
      { year: "2020", event: "Launch of Cloud-Native Platform" },
      { year: "2021", event: "Advanced AI Integration & LLM APIs" },
      { year: "2022", event: "Multi-Agent Systems & RAG Architecture" },
      { year: "2023", event: "Autonomous AI Agents & Neural Networks" },
      {
        year: "2024",
        event: "AGI-Ready Infrastructure & Edge Computing",
      },
    ],
    size: "sm",
    className: "col-span-1 row-span-1",
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const SpotlightFeature = ({ items }: { items: string[] }) => {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item, index) => (
        <motion.li
          key={`spotlight-${item.toLowerCase().replace(/\s+/g, "-")}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm text-muted-foreground">{item}</span>
        </motion.li>
      ))}
    </ul>
  );
};

const CounterAnimation = ({
  start,
  end,
  suffix = "",
}: {
  start: number;
  end: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    let currentFrame = 0;
    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const easedProgress = 1 - (1 - progress) ** 3;
      const current = start + (end - start) * easedProgress;

      setCount(Math.min(current, end));

      if (currentFrame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [start, end]);

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold text-foreground">
        {count.toFixed(1).replace(/\.0$/, "")}
      </span>
      <span className="text-xl font-medium text-foreground">{suffix}</span>
    </div>
  );
};

const ChartAnimation = ({ value }: { value: number }) => {
  return (
    <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </div>
  );
};

const IconsFeature = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border group transition-all duration-300 hover:border-border hover:shadow-md">
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* <OpenAI className="w-7 h-7 transition-transform " /> */}
          <OpenAIDark className="w-7 h-7 transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground">
          OpenAI
        </span>
      </motion.div>
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border group transition-all duration-300 hover:border-border hover:shadow-md">
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* <Anthropic className="w-7 h-7 dark:hidden transition-transform " /> */}
          <AnthropicDark className="w-7 h-7 transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground">
          Anthropic
        </span>
      </motion.div>
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border group transition-all duration-300 hover:border-border hover:shadow-md">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <Google className="w-7 h-7 transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground">
          Google
        </span>
      </motion.div>
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border group transition-all duration-300 hover:border-border hover:shadow-md">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <MistralAI className="w-7 h-7 transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground">
          Hugging Face
        </span>
      </motion.div>
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border group transition-all duration-300 hover:border-border hover:shadow-md">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <DeepSeek className="w-7 h-7 transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground">
          DeepSeek
        </span>
      </motion.div>
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border group transition-all duration-300 hover:border-border hover:shadow-md">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <Plus className="w-6 h-6 text-muted-foreground transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground">
          More
        </span>
      </motion.div>
    </div>
  );
};

const TimelineFeature = ({
  timeline,
}: {
  timeline: Array<{ year: string; event: string }>;
}) => {
  return (
    <div className="mt-3 relative">
      <div className="absolute top-0 bottom-0 left-[9px] w-[2px] bg-muted" />
      {timeline.map((item) => (
        <motion.div
          key={`timeline-${item.year}-${item.event
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          className="flex gap-3 mb-3 relative"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: (0.15 * Number.parseInt(item.year)) % 10,
          }}
        >
          <div className="w-5 h-5 rounded-full bg-card border-2 border-border flex-shrink-0 z-10 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-foreground">
              {item.year}
            </div>
            <div className="text-xs text-muted-foreground">{item.event}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const TypingCodeFeature = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(
        () => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);

          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        },
        Math.random() * 30 + 10,
      ); // Random typing speed for realistic effect

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  // Reset animation when component unmounts and remounts
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, []);

  return (
    <div className="mt-3 relative">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xs text-muted-foreground">
          {/* server.ts */}
          coverletter.tex
        </div>
      </div>
      <div
        ref={terminalRef}
        className="bg-accent text-muted-foreground p-3 rounded-md text-xs font-mono h-[150px] overflow-y-auto"
      >
        <pre className="whitespace-pre-wrap">
          {displayedText}
          <span className="animate-pulse">|</span>
        </pre>
      </div>
    </div>
  );
};

const MetricsFeature = ({
  metrics,
}: {
  metrics: Array<{
    label: string;
    value: number;
    suffix?: string;
    color?: string;
  }>;
}) => {
  const getColorClass = (color = "primary") => {
    const colors = {
      primary: "bg-primary",
      secondary: "bg-secondary",
      accent: "bg-accent",
      destructive: "bg-destructive",
      muted: "bg-muted",
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  return (
    <div className="mt-3 space-y-3">
      {metrics.map((metric, index) => (
        <motion.div
          key={`metric-${metric.label.toLowerCase().replace(/\s+/g, "-")}`}
          className="space-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 * index }}
        >
          <div className="flex justify-between items-center text-sm">
            <div className="text-muted-foreground font-medium flex items-center gap-1.5">
              {metric.label === "Uptime" && <Clock className="w-3.5 h-3.5" />}
              {metric.label === "Response time" && (
                <Zap className="w-3.5 h-3.5" />
              )}
              {metric.label === "Cost reduction" && (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {metric.label}
            </div>
            <div className="text-muted-foreground font-semibold">
              {metric.value}
              {metric.suffix}
            </div>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${getColorClass(metric.color)}`}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, metric.value)}%`,
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: 0.15 * index,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

function AIInput_Voice() {
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (submitted) {
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      setTime(0);
    }

    return () => clearInterval(intervalId);
  }, [submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, 3000);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo]);

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false);
      setSubmitted(false);
    } else {
      setSubmitted((prev) => !prev);
    }
  };

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            submitted ? "bg-none" : "bg-none hover:bg-foreground/10",
          )}
          type="button"
          onClick={handleClick}
        >
          {submitted ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-foreground cursor-pointer pointer-events-auto"
              style={{ animationDuration: "3s" }}
            />
          ) : (
            <Key className="w-6 h-6 text-foreground" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            submitted ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {formatTime(time)}
        </span>

        {/* <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(48)].map((_, i) => (
            <div
              key={`voice-bar-${i}`}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                submitted ? "bg-foreground animate-pulse" : "bg-muted h-1",
              )}
              style={
                submitted && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div> */}

        <p className="h-3 text-xs text-foreground">
          {submitted ? "Generating your resume..." : "Use your API key"}
        </p>
      </div>
    </div>
  );
}

const BentoCard = ({ item }: { item: BentoItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <Link
        href={item.href || "#"}
        className={`
                    group relative flex flex-col gap-4 h-full rounded-xl p-5
                    bg-card border border-border
                    before:absolute before:inset-0 before:rounded-xl
                    before:bg-foreground/10 
                    before:opacity-100 before:transition-opacity before:duration-500
                    after:absolute after:inset-0 after:rounded-xl after:bg-card after:z-[-1]
                    backdrop-blur-[4px]
                    hover:border-border
                    hover:backdrop-blur-[6px]
                    hover:bg-card
                    transition-all duration-500 ease-out ${item.className}
                `}
        tabIndex={0}
        aria-label={`${item.title} - ${item.description}`}
      >
        <div
          className="relative z-10 flex flex-col gap-3 h-full"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-foreground transition-colors duration-300">
                {item.title}
              </h3>
              <div className="text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground tracking-tight">
              {item.description}
            </p>

            {/* Feature specific content */}
            {item.feature === "spotlight" && item.spotlightItems && (
              <SpotlightFeature items={item.spotlightItems} />
            )}

            {item.feature === "counter" && item.statistic && (
              <div className="mt-auto pt-3">
                <CounterAnimation
                  start={item.statistic.start || 0}
                  end={item.statistic.end || 100}
                  suffix={item.statistic.suffix}
                />
              </div>
            )}

            {item.feature === "chart" && item.statistic && (
              <div className="mt-auto pt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.statistic.label}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.statistic.end}
                    {item.statistic.suffix}
                  </span>
                </div>
                <ChartAnimation value={item.statistic.end || 0} />
              </div>
            )}

            {item.feature === "timeline" && item.timeline && (
              <TimelineFeature timeline={item.timeline} />
            )}

            {item.feature === "icons" && <IconsFeature />}

            {item.feature === "typing" && item.typingText && (
              <TypingCodeFeature text={item.typingText} />
            )}

            {item.feature === "metrics" && item.metrics && (
              <MetricsFeature metrics={item.metrics} />
            )}

            {item.icons && !item.feature && (
              <div className="mt-auto pt-4 flex items-center flex-wrap gap-4 border-t border-border">
                <OpenAI className="w-5 h-5 dark:hidden opacity-70 hover:opacity-100 transition-opacity" />
                <OpenAIDark className="w-5 h-5 hidden dark:block opacity-70 hover:opacity-100 transition-opacity" />
                <AnthropicDark className="w-5 h-5 dark:block hidden opacity-70 hover:opacity-100 transition-opacity" />
                <Anthropic className="w-5 h-5 dark:hidden opacity-70 hover:opacity-100 transition-opacity" />
                <Google className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                <MistralAI className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                <DeepSeek className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export function BentoGrid() {
  return (
    <section className="relative py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-6"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp} className="md:col-span-1">
              <BentoCard item={bentoItems[0]!} />
            </motion.div>
            <motion.div variants={fadeInUp} className="md:col-span-2">
              <BentoCard item={bentoItems[1]!} />
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeInUp} className="md:col-span-1">
              <BentoCard item={bentoItems[2]!} />
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="md:col-span-1 rounded-xl overflow-hidden bg-card border border-border hover:border-border hover:shadow-lg hover:shadow-foreground/10 transition-all duration-300"
            >
              <div className="p-5 bg-muted">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    Low Cost{" "}
                    <Badge className="bg-amber-100 text-amber-800">
                      Use your API key
                    </Badge>
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground tracking-tight mb-4">
                  Your api key will be stored in your local storage and send to
                  our server via encryption. You can apply to 100s of jobs in
                  just $0.5. We optimize your cost by advance context
                  engineering, making AI agents continuously learn about your
                  preferences.
                </p>
                <AIInput_Voice />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
