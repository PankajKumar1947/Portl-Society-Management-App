import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { setAccessToken, setRefreshToken } from "@repo/api-client";
import { User } from "@repo/schema";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedAccessToken = await SecureStore.getItemAsync("accessToken");
        const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");

        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setIsAuthenticated(true);
          // Note: user object will be fetched later via session management API
        }
      } catch (e) {
        console.error("Failed to load auth state:", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const signIn = async (accessToken: string, refreshToken: string) => {
    try {
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Failed to sign in:", e);
      throw e;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");

      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      setUser(null);
    } catch (e) {
      console.error("Failed to sign out:", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
