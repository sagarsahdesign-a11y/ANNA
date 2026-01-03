import { createClient } from '@supabase/supabase-js';
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY } from './constants';

// In a real app, these would come from import.meta.env or process.env
// For this demo generator, we use placeholders or fallback to dummy values to prevent crash
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);