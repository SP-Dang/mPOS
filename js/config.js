// =====================================================
// mPOS - PRODUCTION CONFIGURATION
// =====================================================

// Supabase Configuration
const SUPABASE_URL = "https://zddelixvencundnkccpq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZGVsaXh2ZW5jdW5kbmtjY3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjQ1MzMsImV4cCI6MjA5MDcwMDUzM30.-RPvOYMLzftubrpJ4KSVrqL2eNaopjty30_TrnkGpBo";

// Business Rules
const TAX_RATE = 7;
const POINTS_RATE = 10000;
const POINTS_VALUE = 1000;

// Create Supabase client (SINGLE INSTANCE)
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

// Set user context for RLS
async function setSupabaseUserContext() {
    const userId = localStorage.getItem('lsm_user_id');
    const userRole = localStorage.getItem('lsm_role');
    const userName = localStorage.getItem('lsm_user_name');
    
    if (userId && userRole) {
        // Store in localStorage for RLS policies to read
        localStorage.setItem('app_current_user_id', userId);
        localStorage.setItem('app_current_role', userRole);
        localStorage.setItem('app_current_user_name', userName);
        
        console.log('User context set for RLS:', { userId, userRole, userName });
    }
}

// Call this on every page load
setSupabaseUserContext();
