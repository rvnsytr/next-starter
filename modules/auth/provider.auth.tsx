"use client";

import { authorizedRoute } from "@/core/route";
import { notFound, usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { AuthSession } from "./constants";
import { useSession } from "./hooks";

const AuthContext = createContext<AuthSession | undefined>(undefined);

export function AuthProvider({
  session: fallbackData,
  children,
}: {
  session: AuthSession;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, isValidating } = useSession({ fallbackData });

  useEffect(() => {
    const isAuthorized = authorizedRoute(pathname, session?.user.role);
    if (!isAuthorized && !isValidating) return notFound();
  }, [pathname, session, isValidating]);

  if (!session) return;

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used in AuthProvider");
  return ctx;
}
