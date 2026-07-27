import { activity, file } from "./schema";

export type Activity = typeof activity.$inferSelect;
export type ActivityEventType = Activity["eventType"];
export type ActivityWithEntity = Activity & { entity?: string };

export type FileTable = typeof file.$inferSelect;
export type FileVisibility = FileTable["visibility"];
