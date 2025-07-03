import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://leiyebsmlxyoqijutzke.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaXllYnNtbHh5b3FpanV0emtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwODI5MzAsImV4cCI6MjA2NTY1ODkzMH0.k12elOUt3E7_2ttBAxYopmlyFwY5DPdXew4CuxNNmRo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);