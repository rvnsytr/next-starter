import { activities, files } from "./schema";

export type FileTable = typeof files.$inferSelect;

export type Activity = typeof activities.$inferSelect;
export type ActivityWithEntity = Activity & { entity?: string };
