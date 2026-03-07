import { sql } from "drizzle-orm";
import * as schema from "../db/schema";

export { sql, eq, and, or, desc, asc, count, isNotNull } from "drizzle-orm";
export const tables = schema;

export function unixepoch ({ mode }: { mode?: "ms" | "s" }) {
  switch (mode) {
    case "ms":
      return sql`(unixepoch() * 1000)`;
    case "s":
    default:
      return sql`(unixepoch())`;
  }
}
