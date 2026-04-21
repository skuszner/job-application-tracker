import { useEffect, useState } from "react";
import api from "../services/api";

type User = {
  id: string;
  email: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const res = await api.get("/auth/me");
    if (res.status === 200) {
      setUser(res.data);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    await refreshUser();
  };

  const signup = async (email: string, password: string) => {
    const res = await api.post("/auth/signup", { email, password });
    localStorage.setItem("token", res.data.token);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.status === 200) {
          setUser(res.data);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout
  };
}
