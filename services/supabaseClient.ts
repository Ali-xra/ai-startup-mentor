import { createClient } from '@supabase/supabase-js';

// The Supabase URL has been configured for you based on your project dashboard link.
const supabaseUrl = 'https://wuanzjpopjfgzpuktkov.supabase.co';

// The anon key has been configured.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW56anBvcGpmZ3pwdWt0a292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MjUzOTMsImV4cCI6MjA3NTEwMTM5M30.L3AHcUtsVsIY7QAuKT0XMT6rbq1gXMZp_jYJuD6cLXU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);