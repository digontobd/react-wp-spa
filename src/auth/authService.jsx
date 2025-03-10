import { jwtDecode } from "jwt-decode";
const API_URL = "http://localhost/adarbepari/wp-json/jwt-auth/v1/token";

export const login = async (username, password) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Invalid login credentials");

    const data = await response.json();
    localStorage.setItem("ab_token", data.token); // Store JWT Token
    return data;
  } catch (error) {
    console.error("Login error: ", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("ab_token"); // Clear Token
};

export const getToken = () => {
  return localStorage.getItem("ab_token");
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token); // Get expiration time
    if (exp * 1000 < Date.now()) {
      logout(); // Token expired, clear it
      return false;
    }
    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    logout();
    return false;
  }
};
