import { createClient } from "@supabase/supabase-js";
import { Database } from "database.types";

const supabaseUrl = 'https://khapqygkduvyovjquicz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoYXBxeWdrZHV2eW92anF1aWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3Mjg4MzUsImV4cCI6MjA0OTMwNDgzNX0.2qt7PSK4JBgKfK-QBFZWfyeGUPObdFVFJXaDyz7vadc';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
