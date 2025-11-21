import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
import { ac, roles } from "./permission";

export const authClient = createAuthClient({
  plugins: [adminClient({ ac, roles })],
  fetchOptions: {
    onError({ error }) {
      if (error.status === 429) {
        toast.error(
          "Terlalu banyak permintaan. Silakan coba beberapa saat lagi.",
        );
      }
    },
  },
});
