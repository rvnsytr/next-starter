"use client";

import { AuthSession } from "@/core/auth";
import { createContext, ReactNode } from "react";

export const AuthContext = createContext<AuthSession | undefined>(undefined);

export const AuthProvider = ({
  session,
  children,
}: {
  session: AuthSession;
  children: ReactNode;
}) => <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
