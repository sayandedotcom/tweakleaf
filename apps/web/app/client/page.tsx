"use client";

import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Decrypted,
  encrypted,
  resetKeys,
  showExampleFormat,
} from "@/lib/tweetnacl";
import { useRef, useState, useEffect } from "react";

export default function Page() {
  // Get the userId from auth() -- if null, the user is not signed in
  const authData = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [encryptedResult, setEncryptedResult] = useState<string>("");
  const [decryptedResult, setDecryptedResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jsonData, setJsonData] = useState<any>(null);

  // Get the Backend API User object when you need access to the user's information
  const user = useUser();
  const clerk = useClerk();

  // Auto-detect input type when component mounts - MUST be before conditional return
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener("input", handleInputChange);
      return () => input.removeEventListener("input", handleInputChange);
    }
  }, []);

  // Auto-detect if input is JSON and handle accordingly
  const detectAndHandleInput = (input: string) => {
    try {
      // Check if it looks like JSON
      const trimmed = input.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        // Try to parse as JSON
        const parsed = JSON.parse(trimmed);
        setJsonData(parsed);
        setDebugInfo("✅ Detected JSON input - ready to decrypt");
        return { isJson: true, data: parsed };
      } else {
        // Plain text - ready to encrypt
        setJsonData(null);
        setDebugInfo("📝 Plain text detected - ready to encrypt");
        return { isJson: false, data: input };
      }
    } catch (error) {
      // Invalid JSON
      setJsonData(null);
      setDebugInfo("❌ Invalid JSON format");
      return { isJson: false, data: input };
    }
  };

  // Auto-encrypt plain text
  const autoEncrypt = (text: string, password: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setError("");

    try {
      const result = encrypted(text, password);
      if (result === "Encryption failed") {
        setError("Encryption failed");
      } else {
        setEncryptedResult(result);
        setDecryptedResult("");
        setDebugInfo(
          "✅ Text encrypted successfully! Copy the result to decrypt later.",
        );
      }
    } catch (error) {
      setError("Encryption error: " + error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-decrypt JSON data
  const autoDecrypt = (jsonString: string, password: string) => {
    if (!jsonString.trim()) return;

    setIsProcessing(true);
    setError("");

    try {
      const result = Decrypted(jsonString, password);
      if (result.startsWith("Decryption failed")) {
        setError(result);
        setDecryptedResult("");
      } else {
        setDecryptedResult(result);
        setDebugInfo("✅ Text decrypted successfully!");
      }
    } catch (error) {
      setError("Decryption error: " + error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle input changes automatically
  const handleInputChange = () => {
    const value = inputRef.current?.value || "";
    if (value) {
      detectAndHandleInput(value);
    } else {
      setJsonData(null);
      setDebugInfo("");
    }
  };

  // Smart encrypt/decrypt button
  const handleSmartAction = () => {
    const value = inputRef.current?.value || "";
    const password = passwordRef.current?.value || "default-password";

    if (!value.trim()) return;

    const { isJson } = detectAndHandleInput(value);

    if (isJson) {
      // Auto-decrypt JSON
      autoDecrypt(value, password);
    } else {
      // Auto-encrypt plain text
      autoEncrypt(value, password);
    }
  };

  // Manual encrypt button
  const handleEncrypt = () => {
    const value = inputRef.current?.value || "";
    const password = passwordRef.current?.value || "default-password";

    if (value) {
      autoEncrypt(value, password);
    }
  };

  // Manual decrypt button
  const handleDecrypt = () => {
    const value = inputRef.current?.value || "";
    const password = passwordRef.current?.value || "default-password";

    if (value) {
      autoDecrypt(value, password);
    }
  };

  const handleCoverletter = async () => {
    const response = await fetch("/api/coverletter-context", {
      method: "POST",
      body: JSON.stringify({ data: "test" }),
    });
    const data = await response.json();
    console.log(data);
  };

  const handleGetCoverletter = async () => {
    const response = await fetch("/api/coverletter-context", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
  };

  const handleResetKeys = () => {
    if (
      confirm(
        "This will reset your encryption keys. All previously encrypted data will no longer be decryptable. Continue?",
      )
    ) {
      resetKeys();
    }
  };

  const handleClearAll = () => {
    setEncryptedResult("");
    setDecryptedResult("");
    setError("");
    setDebugInfo("");
    setJsonData(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  };

  console.log("decryptedResult", decryptedResult);

  if (!authData.userId) {
    return <div>Sign in to view this page</div>;
  }

  // Use `user` to render user details or create UI elements
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text to Encrypt/Decrypt:
          </label>
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter text to encrypt or paste JSON to decrypt"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password (for encryption/decryption):
          </label>
          <input
            type="password"
            ref={passwordRef}
            placeholder="Enter password (default: default-password)"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleSmartAction}
            disabled={isProcessing}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            title="Automatically detect and encrypt/decrypt"
          >
            {isProcessing ? "Processing..." : "Auto Encrypt/Decrypt"}
          </button>
          <button
            onClick={handleEncrypt}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Encrypt
          </button>
          <button
            onClick={handleDecrypt}
            disabled={isProcessing}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Decrypt
          </button>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleClearAll}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear All
          </button>
          <button
            onClick={() => showExampleFormat()}
            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
            title="Show example of what encrypted data should look like"
          >
            Show Format
          </button>
          <button
            onClick={handleResetKeys}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            title="Reset encryption keys (use if decryption fails)"
          >
            Reset Keys
          </button>
        </div>

        {/* Input Type Detection */}
        {jsonData && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <strong>🔍 Detected Input Type:</strong> JSON Data
            <div className="mt-2 text-xs">
              <strong>Fields found:</strong> {Object.keys(jsonData).join(", ")}
            </div>
          </div>
        )}

        {encryptedResult && (
          <div className="p-3 bg-gray-100 rounded">
            <strong>🔐 Encrypted Result:</strong>
            <div className="mt-2 p-2 bg-white rounded border text-xs font-mono break-all">
              {encryptedResult}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Copy this entire text to decrypt it later. Make sure to use the
              same password!
            </div>
          </div>
        )}

        {decryptedResult && (
          <div className="p-3 bg-gray-100 rounded">
            <strong>🔓 Decrypted Result:</strong>
            <div className="mt-2 p-2 bg-white rounded border">
              <div className="font-mono text-sm break-all">
                {decryptedResult}
              </div>
            </div>

            {/* Show additional info if decrypted result is JSON */}
            {(() => {
              try {
                const parsed = JSON.parse(decryptedResult);
                return (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <strong>📋 Parsed JSON Structure:</strong>
                    <div className="mt-1 text-xs">
                      <strong>Type:</strong> JSON Object
                      <br />
                      <strong>Keys:</strong> {Object.keys(parsed).join(", ")}
                      <br />
                      <strong>Preview:</strong>{" "}
                      {JSON.stringify(parsed, null, 2).substring(0, 200)}
                      {JSON.stringify(parsed, null, 2).length > 200 && "..."}
                    </div>
                  </div>
                );
              } catch {
                return (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <strong>📝 Plain Text:</strong>
                    <div className="mt-1 text-xs">
                      <strong>Length:</strong> {decryptedResult.length}{" "}
                      characters
                      <br />
                      <strong>Type:</strong> String
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {debugInfo && (
          <div className="p-3 bg-blue-100 border border-blue-300 rounded text-blue-700">
            <strong>Debug:</strong> {debugInfo}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          <p>
            <strong>How to use:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Enter text and password, then click "Auto Encrypt/Decrypt"</li>
            <li>Or use individual Encrypt/Decrypt buttons</li>
            <li>The system automatically detects JSON vs plain text</li>
            <li>Copy encrypted results to decrypt later</li>
          </ol>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <strong>🚀 New Features:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Auto-detect:</strong> Automatically detects JSON vs
                plain text
              </li>
              <li>
                <strong>Smart button:</strong> One button handles both encrypt
                and decrypt
              </li>
              <li>
                <strong>Real-time feedback:</strong> Shows what type of input
                was detected
              </li>
              <li>
                <strong>JSON parsing:</strong> Automatically parses and
                validates JSON
              </li>
            </ul>
          </div>

          <div className="mt-2 p-2 bg-gray-200 rounded">
            <strong>What happens automatically:</strong>
            <ul className="list-disc list-inside mt-1">
              <li>Plain text → Auto-encrypt</li>
              <li>JSON data → Auto-decrypt</li>
              <li>Invalid JSON → Show error</li>
              <li>Real-time detection as you type</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
