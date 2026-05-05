// =====================================================
// LSM POS - NEW PROJECT CONFIGURATION
// =====================================================

// NEW Supabase Configuration (mPOS project)
const SUPABASE_URL = "https://rcjvgyetkukyaexzskmg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjanZneWV0a3VreWFleHpza21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzQ2MzUsImV4cCI6MjA5MzQ1MDYzNX0.aNTyK0l1sOYpZ0TdGrmjxIQbafnujQb1hP6dENX_104
"; 

// Business Rules
const TAX_RATE = 7;
const POINTS_RATE = 10000;
const POINTS_VALUE = 1000;

// Create Supabase client and make it global
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// Make constants available globally
window.TAX_RATE = TAX_RATE;
window.POINTS_RATE = POINTS_RATE;
window.POINTS_VALUE = POINTS_VALUE;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_KEY = SUPABASE_KEY;

console.log('✅ Supabase client initialized for new project');
