"use client";

import { useContext } from "react";
import { AuthContext } from "../provider";

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSession must be used in AuthProvider");
  return ctx;
}
