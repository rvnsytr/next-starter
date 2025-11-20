"use client";

import { auth } from "@/core/auth";
import { authorized } from "@/core/utils";
import { notFound, usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect } from "react";
import useSWR from "swr";
import { getSession } from "./actions";

type SessionData = typeof auth.$Infer.Session;

type AuthContextType = { session: SessionData };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  session: fallbackData,
  children,
}: {
  session: SessionData;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSWR("session", getSession, { fallbackData });

  useEffect(() => {
    if (!authorized(pathname, session?.user.role)) return notFound();
  }, [pathname, session]);

  return (
    session && (
      <AuthContext.Provider value={{ session }}>
        {children}
      </AuthContext.Provider>
    )
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used in AuthProvider");
  return ctx;
}
