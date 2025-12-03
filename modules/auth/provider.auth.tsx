"use client";

import { auth } from "@/core/auth";
import { authorized } from "@/core/utils";
import { notFound, usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useSession } from "./hooks";

type AuthContextType = typeof auth.$Infer.Session;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  session: fallbackData,
  children,
}: {
  session: AuthContextType;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession({ fallbackData });

  useEffect(() => {
    const isAuthorized = authorized(pathname, session?.user.role);
    if (!isAuthorized) return notFound();
  }, [pathname, session]);

  return (
    session && (
      <AuthContext.Provider value={{ ...session }}>
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
