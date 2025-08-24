"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function Clerk2Page() {
  const { userId, getToken } = useAuth();
  const [publicMessage, setPublicMessage] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [coverletterMessage, setCoverletterMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // FastAPI backend URL - update this with your actual backend URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  const testPublicEndpoint = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/public`);

      if (response.ok) {
        const data = await response.json();
        setPublicMessage(data.message);
      } else {
        setPublicMessage("Failed to fetch public endpoint");
      }
    } catch (error) {
      console.error("Error testing public endpoint:", error);
      setPublicMessage("Error testing public endpoint");
    } finally {
      setLoading(false);
    }
  };

  const testPrivateEndpoint = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/auth/private`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPrivateMessage(data.message);
      } else {
        setPrivateMessage("Failed to access private endpoint");
      }
    } catch (error) {
      console.error("Error testing private endpoint:", error);
      setPrivateMessage("Error testing private endpoint");
    } finally {
      setLoading(false);
    }
  };

  const testGreetingEndpoint = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/auth/greet`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGreetingMessage(data.message);
      } else {
        setGreetingMessage("Failed to access greeting endpoint");
      }
    } catch (error) {
      console.error("Error testing greeting endpoint:", error);
      setGreetingMessage("Error testing greeting endpoint");
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/auth/user-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setGreetingMessage("User info retrieved successfully!");
      } else {
        setGreetingMessage("Failed to get user info");
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      setGreetingMessage("Error getting user info");
    } finally {
      setLoading(false);
    }
  };

  const testCoverletterContext = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = await getToken();

      const contextData = {
        coverletter_context: "Sample cover letter context data from FastAPI",
        timestamp: new Date().toISOString(),
        source: "FastAPI Backend",
        user_id: userId,
      };

      const response = await fetch(`${API_BASE_URL}/auth/coverletter-context`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contextData),
      });

      if (response.ok) {
        const data = await response.json();
        setCoverletterMessage(`Cover letter context updated: ${data.message}`);
      } else {
        const errorData = await response.json();
        setCoverletterMessage(`Failed to update context: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error updating cover letter context:", error);
      setCoverletterMessage("Error updating cover letter context");
    } finally {
      setLoading(false);
    }
  };

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Clerk + FastAPI Auth Integration (Simple)
      </h1>

      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p>
            <strong>User ID:</strong> {userId}
          </p>
        </div>

        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">
              Public Endpoint (No Auth Required)
            </h3>
            <button
              onClick={testPublicEndpoint}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Test Public Endpoint"}
            </button>
            {publicMessage && (
              <p className="mt-2 text-green-700">{publicMessage}</p>
            )}
          </div>

          <div className="border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">
              Private Endpoint (Auth Required)
            </h3>
            <button
              onClick={testPrivateEndpoint}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Test Private Endpoint"}
            </button>
            {privateMessage && (
              <p className="mt-2 text-green-700">{privateMessage}</p>
            )}
          </div>

          <div className="border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">
              Greeting Endpoint (Auth Required)
            </h3>
            <button
              onClick={testGreetingEndpoint}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Test Greeting Endpoint"}
            </button>
            {greetingMessage && (
              <p className="mt-2 text-green-700">{greetingMessage}</p>
            )}
          </div>

          <div className="border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">
              User Info Endpoint (Auth Required)
            </h3>
            <button
              onClick={getUserInfo}
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Get User Info"}
            </button>
            {userInfo && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">User Information:</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>User ID:</strong> {userInfo.user_id}
                  </p>
                  <p>
                    <strong>Email:</strong> {userInfo.email || "Not available"}
                  </p>
                  <p>
                    <strong>First Name:</strong>{" "}
                    {userInfo.first_name || "Not available"}
                  </p>
                  <p>
                    <strong>Last Name:</strong>{" "}
                    {userInfo.last_name || "Not available"}
                  </p>
                  <p>
                    <strong>Full Name:</strong>{" "}
                    {userInfo.full_name || "Not available"}
                  </p>
                  <p>
                    <strong>Session ID:</strong> {userInfo.session_id}
                  </p>
                  <p>
                    <strong>Role:</strong> {userInfo.role || "Not available"}
                  </p>
                  <p>
                    <strong>Plan:</strong> {userInfo.plan || "Not available"}
                  </p>
                  <p>
                    <strong>Issued At:</strong>{" "}
                    {new Date(userInfo.issued_at * 1000).toLocaleString()}
                  </p>
                  <p>
                    <strong>Expires At:</strong>{" "}
                    {new Date(userInfo.expires_at * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">
              Cover Letter Context (Supabase + Auth)
            </h3>
            <button
              onClick={testCoverletterContext}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Update Cover Letter Context"}
            </button>
            {coverletterMessage && (
              <p className="mt-2 text-green-700">{coverletterMessage}</p>
            )}
          </div>
        </div>

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <h3 className="font-semibold">How This Works:</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong>Public:</strong> No authentication required
            </li>
            <li>
              <strong>Private:</strong> JWT token verified using JWKS and PyJWT
            </li>
            <li>
              <strong>Greeting:</strong> JWT decoded to extract user information
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
