import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
export const clauses = sqliteTable("clauses", { id: integer("id").primaryKey({autoIncrement:true}), body:text("body").notNull(), createdAt:integer("created_at").notNull(), visitor:text("visitor"), network:text("network"), displayName:text("display_name") });
