import { activity, file } from "./schema";

export type Activity = typeof activity.$inferSelect;

export type FileTable = typeof file.$inferSelect;
