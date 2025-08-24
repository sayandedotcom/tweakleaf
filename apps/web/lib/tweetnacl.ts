import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

// Get or generate a consistent salt for this session
const getOrCreateSalt = () => {
  if (typeof window === "undefined") {
    // Server-side, generate new salt
    return nacl.randomBytes(32); // Increased salt size for better security
  }

  let salt = localStorage.getItem("tweetnacl_salt");
  if (!salt) {
    salt = naclUtil.encodeBase64(nacl.randomBytes(32));
    localStorage.setItem("tweetnacl_salt", salt);
  }
  return naclUtil.decodeBase64(salt);
};

const salt = getOrCreateSalt();

// Stronger key derivation using multiple rounds of hashing
const deriveKey = (password: string, saltBytes: Uint8Array): Uint8Array => {
  const passwordBytes = naclUtil.decodeUTF8(password);
  const combined = new Uint8Array(passwordBytes.length + saltBytes.length);
  combined.set(passwordBytes);
  combined.set(saltBytes, passwordBytes.length);

  // Multiple rounds of hashing for better security (simpler than PBKDF2 but still effective)
  let key = nacl.hash(combined);
  for (let i = 0; i < 10000; i++) {
    // 10,000 iterations for security
    const newCombined = new Uint8Array(key.length + saltBytes.length);
    newCombined.set(key);
    newCombined.set(saltBytes, key.length);
    key = nacl.hash(newCombined);
  }

  return key.slice(0, 32);
};

export const encrypted = (
  apiKey: string,
  password: string = "default-password",
): string => {
  if (!apiKey) return "";

  console.log("🔐 Encryption started");
  console.log("Input:", apiKey);
  console.log("Password length:", password.length);
  console.log("Salt length:", salt.length);

  try {
    // Derive key from password and salt using multiple rounds of hashing
    const key = deriveKey(password, salt);
    console.log("Derived key length:", key.length);

    // Generate a unique nonce for each encryption
    const nonce = nacl.randomBytes(24);
    console.log("Nonce generated, length:", nonce.length);

    const encryptedBytes = nacl.secretbox(
      naclUtil.decodeUTF8(apiKey),
      nonce,
      key,
    );
    console.log("Encrypted bytes length:", encryptedBytes.length);

    // Store nonce, encrypted data, and salt
    const data = {
      encrypted: naclUtil.encodeBase64(encryptedBytes),
      nonce: naclUtil.encodeBase64(nonce),
      salt: naclUtil.encodeBase64(salt),
      version: "2", // Version indicator for future compatibility
      algorithm: "MultiHash-10k", // Show what was used
    };

    const result = JSON.stringify(data);
    console.log("Final encrypted result:", result);
    return result;
  } catch (error) {
    console.error("Encryption error:", error);
    return "Encryption failed";
  }
};

export const Decrypted = (
  encryptedData: string,
  password: string = "default-password",
): string => {
  if (!encryptedData) return "";

  console.log("🔓 Decryption started");
  console.log("Input:", encryptedData);
  console.log("Input type:", typeof encryptedData);
  console.log("Input length:", encryptedData.length);
  console.log("Password length:", password.length);

  // Check if input looks like JSON
  const trimmedInput = encryptedData.trim();
  if (!trimmedInput.startsWith("{") || !trimmedInput.endsWith("}")) {
    console.error("❌ Input doesn't look like valid JSON (missing { or })");
    console.error("Input starts with:", trimmedInput.substring(0, 10));
    console.error(
      "Input ends with:",
      trimmedInput.substring(trimmedInput.length - 10),
    );
    console.error("❌ WHAT YOU ENTERED:", encryptedData);
    console.error(
      "❌ WHAT YOU NEED: A JSON string that starts with { and ends with }",
    );
    console.error('❌ EXAMPLE: {"encrypted":"...","nonce":"...","salt":"..."}');
    return "Decryption failed: Invalid input format. You need to paste the encrypted result (JSON format), not plain text.";
  }

  try {
    // Parse the JSON data
    const data = JSON.parse(trimmedInput);
    console.log("Parsed data:", data);

    // Validate required fields
    if (!data.encrypted || !data.nonce || !data.salt) {
      console.error("❌ Missing required fields in parsed data");
      console.error("Available fields:", Object.keys(data));
      return "Decryption failed: Missing required fields";
    }

    // Decode from base64
    const encryptedBytes = naclUtil.decodeBase64(data.encrypted);
    const nonceBytes = naclUtil.decodeBase64(data.nonce);
    const saltBytes = naclUtil.decodeBase64(data.salt);
    console.log("Decoded encrypted length:", encryptedBytes.length);
    console.log("Decoded nonce length:", nonceBytes.length);
    console.log("Decoded salt length:", saltBytes.length);

    // Derive key from password and salt using PBKDF2
    const key = deriveKey(password, saltBytes);
    console.log("Derived key length:", key.length);

    // Decrypt the data
    const decryptedBytes = nacl.secretbox.open(encryptedBytes, nonceBytes, key);
    console.log("Decryption result:", decryptedBytes ? "Success" : "Failed");

    if (!decryptedBytes) {
      throw new Error("Decryption failed");
    }

    // Convert back to string
    const result = naclUtil.encodeUTF8(decryptedBytes);
    console.log("Final decrypted result:", result);
    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("❌ JSON parsing error:", error.message);
      console.error(
        "Failed at position:",
        error.message.match(/position (\d+)/)?.[1],
      );
      console.error("Input preview:", encryptedData.substring(0, 100));
      return "Decryption failed: Invalid JSON format";
    }
    console.error("Decryption error:", error);
    return "Decryption failed";
  }
};

// Function to reset keys and salt (useful for testing or security purposes)
export const resetKeys = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("tweetnacl_key");
    localStorage.removeItem("tweetnacl_salt");
    // Reload the page to regenerate keys
    window.location.reload();
  }
};

// Helper function to show what encrypted data should look like
export const showExampleFormat = () => {
  console.log("=== ENCRYPTED DATA FORMAT EXAMPLE ===");
  console.log("The encrypted result should look like this:");
  console.log("{");
  console.log('  "encrypted": "base64EncryptedDataHere...",');
  console.log('  "nonce": "base64NonceHere...",');
  console.log('  "salt": "base64SaltHere...",');
  console.log('  "version": "2",');
  console.log('  "algorithm": "MultiHash-10k"');
  console.log("}");
  console.log("");
  console.log("Make sure to copy the ENTIRE text including the curly braces!");
  console.log("Don't copy just part of it or add extra characters.");
  console.log("");
  console.log("🔒 Security Features:");
  console.log("- Multi-round key derivation with 10,000 iterations");
  console.log("- 32-byte salt for better entropy");
  console.log("- Unique nonce for each encryption");
  console.log("- NaCl secretbox for authenticated encryption");
};
