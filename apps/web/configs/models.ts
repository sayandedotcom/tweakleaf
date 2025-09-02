import { llmModelsSvg } from "./llm-models-svg";
import { navigation } from "./navigation";

// TypeScript interface for model configuration
export interface ModelConfig {
  name: string;
  logo: (props: { className?: string }) => React.JSX.Element;
  url: string;
  model: string;
  configured: boolean;
  apiKeyUrl: string;
  isConfigured: () => boolean;
}

// Helper function to check if a model is configured
const checkModelConfiguration = (modelUrl: string): boolean => {
  if (typeof window === "undefined") return false; // SSR safety

  try {
    const stored = localStorage.getItem("tweak_jobs_model_api_keys");
    if (stored) {
      const parsed = JSON.parse(stored);
      const key = modelUrl.toLowerCase();
      return parsed[key] && parsed[key].trim().length > 0;
    }
  } catch (error) {
    console.error("Error checking model configuration:", error);
  }
  return false;
};

export const models: ModelConfig[] = [
  {
    name: "OpenAI",
    logo: llmModelsSvg.openai,
    url: navigation.MODEL.OPENAI,
    model: "gpt-4o",
    configured: false, // This will be dynamically updated
    apiKeyUrl: "https://platform.openai.com/api-keys",
    isConfigured: () => checkModelConfiguration(navigation.MODEL.OPENAI),
  },
  {
    name: "Anthropic",
    logo: llmModelsSvg.anthropic,
    url: navigation.MODEL.ANTHROPIC,
    model: "claude-3-5-sonnet-20240620",
    configured: false, // This will be dynamically updated
    apiKeyUrl: "https://console.anthropic.com",
    isConfigured: () => checkModelConfiguration(navigation.MODEL.ANTHROPIC),
  },
  {
    name: "Gemini",
    logo: llmModelsSvg.gemini,
    url: navigation.MODEL.GEMINI,
    model: "gemini-2.0-flash-exp",
    configured: false, // This will be dynamically updated
    apiKeyUrl: "https://aistudio.google.com/app/apikey",
    isConfigured: () => checkModelConfiguration(navigation.MODEL.GEMINI),
  },
  // {
  //   name: "Grok",
  //   logo: llmModelsSvg.grok,
  //   url: navigation.MODEL.GROK,
  //   model: "llama-3.1-8b-instant",
  //   configured: false, // This will be dynamically updated
  //   apiKeyUrl: "https://console.x.ai",
  //   isConfigured: () => checkModelConfiguration(navigation.MODEL.GROK),
  // },
  {
    name: "DeepSeek",
    logo: llmModelsSvg.deepseek,
    url: navigation.MODEL.DEEPSEEK,
    model: "deepseek-chat",
    configured: false, // This will be dynamically updated
    apiKeyUrl: "https://platform.deepseek.com",
    isConfigured: () => checkModelConfiguration(navigation.MODEL.DEEPSEEK),
  },
  {
    name: "Hugging Face",
    logo: llmModelsSvg.huggingface,
    url: navigation.MODEL.HUGGINGFACE,
    model: "huggingface-chat",
    configured: false, // This will be dynamically updated
    apiKeyUrl:
      "https://huggingface.co/docs/huggingface_hub/v0.13.2/en/guides/inference",
    isConfigured: () => checkModelConfiguration(navigation.MODEL.HUGGINGFACE),
  },
];
