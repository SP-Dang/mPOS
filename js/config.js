// =====================================================
// LSM POS - NEW PROJECT CONFIGURATION
// =====================================================

// NEW Supabase Configuration
const SUPABASE_URL = "https://rcjvgyetkukyaexzskmg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjanZneWV0a3VreWFleHpza21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzQ2MzUsImV4cCI6MjA5MzQ1MDYzNX0.aNTyK0l1sOYpZ0TdGrmjxIQbafnujQb1hP6dENX_104
";  // ← PASTE YOUR NEW KEY HERE

// Business Rules
const TAX_RATE = 7;
const POINTS_RATE = 10000;
const POINTS_VALUE = 1000;

// Create Supabase client
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    }
});

// Make constants available globally
window.TAX_RATE = TAX_RATE;
window.POINTS_RATE = POINTS_RATE;
window.POINTS_VALUE = POINTS_VALUE;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_KEY = SUPABASE_KEY;

// Set user context for RLS
async function setSupabaseUserContext() {
    const userId = localStorage.getItem('lsm_user_id');
    const userRole = localStorage.getItem('lsm_role');
    const userName = localStorage.getItem('lsm_user_name');
    
    if (userId && userRole) {
        localStorage.setItem('app_current_user_id', userId);
        localStorage.setItem('app_current_role', userRole);
        localStorage.setItem('app_current_user_name', userName);
        console.log('User context set for RLS:', { userId, userRole, userName });
    }
}

setSupabaseUserContext();
