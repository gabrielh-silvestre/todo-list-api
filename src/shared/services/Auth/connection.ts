import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_KEY } = process.env;

const supabase = createClient(SUPABASE_URL as string, SUPABASE_KEY as string, {
  shouldThrowOnError: true,
});

export { supabase };
