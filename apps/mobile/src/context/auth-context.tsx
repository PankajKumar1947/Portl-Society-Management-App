import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { setAccessToken, setRefreshToken } from "@repo/api-client";
import { User } from "@repo/schema";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSocietyCreated: boolean;
  isLoading: boolean;
  signIn: (accessToken: string, refreshToken: string, isSocietyCreated: boolean) => Promise<void>;
  markSocietyCreated: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSocietyCreated, setIsSocietyCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedAccessToken = await SecureStore.getItemAsync("accessToken");
        const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
        const storedSocietyCreated = await SecureStore.getItemAsync("isSocietyCreated");

        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setIsAuthenticated(true);
          setIsSocietyCreated(storedSocietyCreated === "true");
        }
      } catch (e) {
        console.error("Failed to load auth state:", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const signIn = async (accessToken: string, refreshToken: string, societyCreatedStatus: boolean) => {
    try {
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      await SecureStore.setItemAsync("isSocietyCreated", societyCreatedStatus ? "true" : "false");

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setIsAuthenticated(true);
      setIsSocietyCreated(societyCreatedStatus);
    } catch (e) {
      console.error("Failed to sign in:", e);
      throw e;
    }
  };

  const markSocietyCreated = async () => {
    try {
      await SecureStore.setItemAsync("isSocietyCreated", "true");
      setIsSocietyCreated(true);
    } catch (e) {
      console.error("Failed to mark society created:", e);
      throw e;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("isSocietyCreated");

      setAccessToken(null);
      setRefreshToken(null);
      setIsAuthenticated(false);
      setIsSocietyCreated(false);
      setUser(null);
    } catch (e) {
      console.error("Failed to sign out:", e);
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSocietyCreated,
        isLoading,
        signIn,
        markSocietyCreated,
        signOut,
      }}
    >
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
