import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dimztabtlovjojlrrkjj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpbXp0YWJ0bG92am9qbHJya2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzM3NzUsImV4cCI6MjA5MDQ0OTc3NX0.WbK9Gb8ngaFrkp2ky0plvsbuY00lPjGib7W0BJX40AI';

export const supabase = createClient(supabaseUrl, supabaseKey);
