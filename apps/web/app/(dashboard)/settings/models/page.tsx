"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Edit,
  Save,
  XCircle,
  Key,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { navigation } from "@/configs/navigation";
import { llmModelsSvg } from "@/configs/llm-models-svg";
import router from "next/router";
import { models, ModelConfig } from "@/configs/models";

interface ModelKey {
  [key: string]: string;
}

const STORAGE_KEY = "tweak_jobs_model_api_keys";

export default function ModelsSettingsPage() {
  const [modelKeys, setModelKeys] = useState<ModelKey>({});
  const [editingModel, setEditingModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load API keys from localStorage on component mount
  useEffect(() => {
    const loadApiKeys = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setModelKeys(parsed);
        }
      } catch (error) {
        console.error("Error loading API keys from localStorage:", error);
      }
    };

    loadApiKeys();
  }, []);

  // Save API keys to localStorage
  const saveToLocalStorage = (keys: ModelKey) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } catch (error) {
      console.error("Error saving API keys to localStorage:", error);
    }
  };

  const hasApiKey = (modelKey: string) => {
    const key = modelKeys[modelKey.toLowerCase()];
    return key && key.trim().length > 0;
  };

  const isModelConfigured = (modelUrl: string) => {
    // Use refreshTrigger to ensure we get the latest data
    const _ = refreshTrigger;

    const model = models.find((m) => m.url === modelUrl);
    return model ? model.isConfigured() : false;
  };

  // Force refresh of configuration status
  const refreshConfigurationStatus = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSave = async (modelKey: string) => {
    setIsLoading(true);

    try {
      // Update the model keys
      const updatedKeys = { ...modelKeys };
      updatedKeys[modelKey.toLowerCase()] =
        modelKeys[modelKey.toLowerCase()] || "";

      // Save to localStorage
      saveToLocalStorage(updatedKeys);
      setModelKeys(updatedKeys);

      // Dispatch custom event for other components to react
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("localStorageChange", {
            detail: { key: "tweak_jobs_model_api_keys", value: updatedKeys },
          }),
        );
      }

      // Refresh configuration status
      refreshConfigurationStatus();

      // Exit editing mode
      setEditingModel(null);
    } catch (error) {
      console.error("Error saving API key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveKey = (modelKey: string) => {
    try {
      const updatedKeys = { ...modelKeys };
      delete updatedKeys[modelKey.toLowerCase()];

      // Save to localStorage
      saveToLocalStorage(updatedKeys);
      setModelKeys(updatedKeys);

      // Dispatch custom event for other components to react
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("localStorageChange", {
            detail: { key: "tweak_jobs_model_api_keys", value: updatedKeys },
          }),
        );
      }

      // Refresh configuration status
      refreshConfigurationStatus();

      // Exit editing mode if currently editing
      if (editingModel === modelKey) {
        setEditingModel(null);
      }
    } catch (error) {
      console.error("Error removing API key:", error);
    }
  };

  const handleCancel = () => {
    setEditingModel(null);
  };

  const toggleApiKeyVisibility = (modelKey: string) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [modelKey]: !prev[modelKey],
    }));
  };

  const handleInputChange = (modelKey: string, value: string) => {
    setModelKeys((prev) => ({
      ...prev,
      [modelKey.toLowerCase()]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Model Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your API keys for different language models. These keys are
          stored locally in your browser and used to access the respective AI
          services.
        </p>
      </div>

      <div className="grid gap-4">
        {models.map((model) => {
          const modelKey = model.url.toLowerCase();
          const isEditing = editingModel === modelKey;
          const hasKey = isModelConfigured(model.url);
          const currentValue = modelKeys[modelKey] || "";

          return (
            <Card key={modelKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8">
                      {model.logo({
                        className: "w-full h-full bg-text rounded-xl",
                      })}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>
                        {hasKey
                          ? "API key configured"
                          : "No API key configured"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasKey && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200"
                      >
                        <CheckCircle color="green" className="h-3 w-3" />
                        Configured
                      </Badge>
                    )}
                    {!hasKey && (
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 bg-red-100 text-red-800 border-red-200"
                      >
                        <XCircle color="red" className="h-3 w-3" />
                        Not Configured
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label
                    htmlFor={`api-key-${modelKey}`}
                    className="flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    API Key
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id={`api-key-${modelKey}`}
                        type={showApiKeys[modelKey] ? "text" : "password"}
                        value={currentValue}
                        onChange={(e) =>
                          handleInputChange(modelKey, e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder={`Enter your ${model.name} API key`}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => toggleApiKeyVisibility(modelKey)}
                      >
                        {showApiKeys[modelKey] ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(modelKey)}
                          disabled={isLoading}
                          size="sm"
                        >
                          <Save color="black" className="h-4 w-4 mr-2" />
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingModel(modelKey)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {hasKey ? "Edit" : "Set Key"}
                        </Button>
                        {hasKey && (
                          <Button
                            onClick={() => handleRemoveKey(modelKey)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* How to get API key info for each model */}
                  <div className="p-3 bg-muted rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>How to get {model.name} API key:</strong>
                    </p>
                    <span className="text-xs text-muted-foreground">
                      To get your {model.name} API key, visit{" "}
                    </span>
                    <span
                      onClick={() => router.push(model.apiKeyUrl)}
                      className="text-xs text-muted-foreground underline"
                    >
                      {model.apiKeyUrl}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* More models coming soon */}
      <Card className="border-dashed border-muted bg-muted/50">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-medium text-muted-foreground">
                More Models Coming Soon
              </h4>
              <p className="text-sm text-muted-foreground">
                We're constantly adding support for new AI models. Stay tuned
                for updates!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
