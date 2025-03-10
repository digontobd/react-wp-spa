import { createContext, useState, useEffect } from "react";
import { getToken, login, logout } from "./authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser({ token }); // Ideally, decode token to get user info
    }
    setLoading(false);
  }, []);

  const handleLogin = async (username, password) => {
    const data = await login(username, password);
    setUser({ token: data.token });
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
