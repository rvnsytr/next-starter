import { activity, files } from "./schema";

export type Activity = typeof activity.$inferSelect;

export type FileTable = typeof files.$inferSelect;
