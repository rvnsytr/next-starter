import { ac, roles } from "@/config/permission";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

export const authClient = createAuthClient({
  plugins: [adminClient({ ac, roles })],
  fetchOptions: {
    onError({ error }) {
      const e = "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.";
      if (error.status === 429) toast.error(e);
    },
  },
});
