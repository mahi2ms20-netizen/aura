import React, { createContext, useContext } from "react";

export type SessionUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  city?: string;
};

type AuthContextType = {
  token: string | null;
  user: SessionUser | null;
  loading: boolean;
  signInAs: (role: "admin" | "brand") => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: false,
  signInAs: async () => {},
  logout: () => {},
});

export const AuthProvider = AuthContext.Provider;

export function useAuth() {
  return useContext(AuthContext);
}
