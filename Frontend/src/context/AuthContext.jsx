import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load → call /api/auth/me to restore session from HttpOnly cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user || res.data);
      } catch {
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password, role) => {
    try {
      const res = await api.post("/api/auth/login", { email, password, role });
      const loggedInUser = res.data.user || res.data;
      if (res.data.token) localStorage.setItem("token", res.data.token);
      setUser(loggedInUser);
      return { ok: true };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid credentials";
      return { ok: false, error: msg };
    }
  }, []);

  const signup = useCallback(async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
        ...(data.patientProfile && { patientProfile: data.patientProfile }),
        ...(data.doctorProfile && { doctorProfile: data.doctorProfile }),
      };
      const res = await api.post("/api/auth/register", payload);
      const newUser = res.data.user || res.data;
      if (res.data.token) localStorage.setItem("token", res.data.token);
      setUser(newUser);
      return { ok: true };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Signup failed";
      return { ok: false, error: msg };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // cookie cleared server-side; ignore errors
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await api.put("/api/users/profile", updates);
      if (res.data.success) {
        setUser(res.data.user);
        return { ok: true };
      }
      return { ok: false, error: "Failed to update profile" };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Profile update failed";
      return { ok: false, error: msg };
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
    }),
    [user, isLoading, login, signup, logout, updateProfile]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}