import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/** A Supabase client typed against our schema. Web and mobile each create their own. */
export type BasecampClient = SupabaseClient<Database>;

type Result<T> = { data: T | null; error: { message: string } | null };

/** Throws on a Supabase error so callers can use plain try/catch (for writes without a returned row). */
export function check(result: Result<unknown>): void {
  if (result.error) throw new Error(result.error.message);
}

/** Like `check`, but returns the data and treats a missing row as an error. */
export function unwrap<R extends Result<unknown>>(result: R): NonNullable<R["data"]> {
  check(result);
  if (result.data == null) throw new Error("Not found");
  return result.data as NonNullable<R["data"]>;
}
