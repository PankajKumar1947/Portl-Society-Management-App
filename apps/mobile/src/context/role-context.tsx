import { UserRole } from "@repo/schema";
import React, { createContext, useContext, useState } from "react";

interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole | null>("ADMIN");

  const setRole = (newRole: UserRole | null) => {
    setRoleState(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
