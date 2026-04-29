import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
    file: r.one.file({
      from: r.user.image,
      to: r.file.id,
      optional: true,
    }),
    activities: r.many.activity(),
  },

  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },

  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },

  activity: {
    user: r.one.user({
      from: r.activity.userId,
      to: r.user.id,
    }),
  },
}));
