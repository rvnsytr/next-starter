"use client";

import { AuthSession } from "@/core/auth";
import { authorizedRoute } from "@/core/route";
import { notFound, usePathname } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";

const AuthContext = createContext<AuthSession | undefined>(undefined);

export function AuthProvider({
  session,
  children,
}: {
  session: AuthSession;
  children: ReactNode;
}) {
  const pathname = usePathname();
  // const { data: session, isValidating } = useSession({ fallbackData });

  // useEffect(() => {
  //   const isAuthorized = authorizedRoute(pathname, session?.user.role);
  //   if (!isAuthorized && !isValidating) return notFound();
  // }, [pathname, session, isValidating]);

  const isAuthorized = authorizedRoute(pathname, session?.user.role);
  if (!isAuthorized) return notFound();

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSession must be used in AuthProvider");
  return ctx;
}
