import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and anon/public key
const supabaseUrl = 'https://cqftmkxocvsrzmvpzlte.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZnRta3hvY3ZzcnptdnB6bHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjY2OTcsImV4cCI6MjA2ODkwMjY5N30.rfEddQeG3oFuds17hrM97lUZCQ-NYwAvjU-Ht9HS8mI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 