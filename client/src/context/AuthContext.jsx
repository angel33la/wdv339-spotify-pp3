import { createContext, useEffect, useState } from "react";
import { getMe } from "../api/authApi";
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

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

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
        logout();
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
