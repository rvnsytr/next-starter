import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    sessions: r.many.sessions({
      from: r.users.id,
      to: r.sessions.userId,
    }),
    accounts: r.many.accounts({
      from: r.users.id,
      to: r.accounts.userId,
    }),
    activities: r.many.activity({
      from: r.users.id,
      to: r.activity.userId,
    }),
    file: r.one.files({
      from: r.users.image,
      to: r.files.id,
      optional: true,
    }),
  },

  accounts: {
    user: r.one.users({
      from: r.accounts.userId,
      to: r.users.id,
    }),
  },

  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },

  activity: {
    user: r.one.users({
      from: r.activity.userId,
      to: r.users.id,
    }),
  },
}));
