"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAcl, aclQueries } from "@repo/api-client";
import type { AclResponse, AclData } from "@repo/schema";

interface AccessControlContextType {
  data: AclData | undefined;
  isLoading: boolean;
}

const AccessControlContext = createContext<AccessControlContextType | undefined>(undefined);

export const AccessControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading } = useQuery({
    queryKey: aclQueries.get.key,
    queryFn: getAcl,
    select: (response: AclResponse) => response.data,
    staleTime: Infinity,
  });

  return (
    <AccessControlContext.Provider value={{ data, isLoading }}>
      {children}
    </AccessControlContext.Provider>
  );
};

export const useAccessControlContext = () => {
  const context = useContext(AccessControlContext);
  if (!context) {
    throw new Error("useAccessControlContext must be used within an AccessControlProvider");
  }
  return context;
};
