import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

const { task_db_service_role, task_db_url } = process.env;

export const supabase = createClient<Database>(
	task_db_url!,
	task_db_service_role!
);
