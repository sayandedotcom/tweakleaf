"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function Page() {
  const { userId, getToken } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // FastAPI backend URL - update this with your actual backend URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

  const fetchUserInfo = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = await getToken();

      // Debug: Log the token
      console.log("DEBUG: Token received:", token);
      console.log("DEBUG: Token length:", token ? token.length : 0);
      console.log(
        "DEBUG: Token preview:",
        token ? `${token.substring(0, 50)}...` : "No token",
      );

      const response = await fetch(`${API_BASE_URL}/clerk/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
        setMessage("Successfully fetched user info from FastAPI backend!");
      } else {
        setMessage("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setMessage("Error fetching user info");
    } finally {
      setLoading(false);
    }
  };

  const testProtectedEndpoint = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/clerk/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Protected endpoint access: ${data.message}`);
      } else {
        setMessage("Failed to access protected endpoint");
      }
    } catch (error) {
      console.error("Error accessing protected endpoint:", error);
      setMessage("Error accessing protected endpoint");
    } finally {
      setLoading(false);
    }
  };

  const updateUserContext = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = await getToken();

      const contextData = {
        coverletter_context: "Sample cover letter context data",
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/clerk/update-context`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contextData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Context updated: ${data.data.message}`);
      } else {
        setMessage("Failed to update context");
      }
    } catch (error) {
      console.error("Error updating context:", error);
      setMessage("Error updating context");
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
      <h1 className="text-3xl font-bold mb-6">Clerk + FastAPI Integration</h1>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p>
            <strong>User ID:</strong> {userId}
          </p>
          {userInfo && (
            <div className="mt-2">
              <p>
                <strong>Full Name:</strong> {userInfo.full_name}
              </p>
              <p>
                <strong>Email:</strong> {userInfo.email}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={fetchUserInfo}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Fetch User Info from FastAPI"}
          </button>

          <button
            onClick={testProtectedEndpoint}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-2"
          >
            {loading ? "Loading..." : "Test Protected Endpoint"}
          </button>

          <button
            onClick={updateUserContext}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 ml-2"
          >
            {loading ? "Loading..." : "Update User Context"}
          </button>
        </div>

        {message && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
