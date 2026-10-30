import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔴 Todo:
// 1. implement the login and logout functions to update the user state, and pass { user, login, logout } as the Provider's value.
// 2. wrap the AuthProvider around appropriate components in the app (see main.tsx) to provide global state management for authentication.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((nextUser: User) => setUser(nextUser), []);
  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 🔴 Todo: finish the useAuth hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>!");
  }
  return context;
}
