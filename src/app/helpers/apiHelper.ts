import { getSession } from "next-auth/react";

// apiHelper.ts
export const apiHelper = async (
  url: string,
  method: string,
  body: Record<string, unknown> | null = null,
  isAuthenticated: boolean = true
): Promise<unknown> => {
  let token = null;

  if (isAuthenticated) {
    const session = await getSession() as SessionResponse;
    token = session?.accessToken || null;
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (isAuthenticated && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  // Include body only if method is not GET or HEAD
  if (body && method !== "GET" && method !== "HEAD") {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.tokenExpired) {
        return { tokenExpired: true };
      }
      return errorData
    }

    // If the response is OK, parse the JSON
    return response.json();
  } catch (error) {
    console.log("API call error:", error);
    return { message: "Internal Server Error" };
  }
};
