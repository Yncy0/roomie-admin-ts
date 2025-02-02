import { createClient } from "@supabase/supabase-js";
import { Database } from "database.types";

const supabaseUrl = 'https://vjvuhazfxkuqegqlkums.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdnVoYXpmeGt1cWVncWxrdW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjYzNTEsImV4cCI6MjA0NjMwMjM1MX0.Zhr4aS-oVOhWkHsV9_8s2X1ocxr7CVfrXrc8rfx2n84';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
