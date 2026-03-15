import { createContext, useEffect, useState } from "react";
import { getMe, logoutRequest } from "../api/authApi";
import { getToken, removeToken, setToken } from "../utils/token";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithToken = async (jwt) => {
    setToken(jwt);
    setTokenState(jwt);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Client-side cleanup should still run even if backend logout fails.
    }

    removeToken();
    setTokenState(null);
    setUser(null);
  };

  useEffect(() => {
    const syncTokenFromStorage = () => {
      const latest = getToken();
      setTokenState(latest);
    };

    window.addEventListener("storage", syncTokenFromStorage);
    window.addEventListener("focus", syncTokenFromStorage);
    window.addEventListener("auth-token-changed", syncTokenFromStorage);

    return () => {
      window.removeEventListener("storage", syncTokenFromStorage);
      window.removeEventListener("focus", syncTokenFromStorage);
      window.removeEventListener("auth-token-changed", syncTokenFromStorage);
    };
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getMe(token);
        setUser(userData);
      } catch {
        await logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, user, loading, loginWithToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
