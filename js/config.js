// =====================================================
// LSM POS - CONFIGURATION
// =====================================================

// Supabase Configuration
const SUPABASE_URL = "https://rcjvgyetkukyaexzskmg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjanZneWV0a3VreWFleHpza21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzQ2MzUsImV4cCI6MjA5MzQ1MDYzNX0.aNTyK0l1sOYpZ0TdGrmjxIQbafnujQb1hP6dENX_104";

// Create Supabase client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Business Rules
window.TAX_RATE = 7;
window.POINTS_RATE = 10000;
window.POINTS_VALUE = 1000;

// Log to confirm
console.log('✅ Config loaded - supabaseClient ready:', typeof window.supabaseClient);
