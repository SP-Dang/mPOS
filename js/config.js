// =====================================================
// LSM POS - SHARED CONFIGURATION
// =====================================================

// Supabase Configuration
const SUPABASE_URL = "https://zddelixvencundnkccpq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZGVsaXh2ZW5jdW5kbmtjY3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjQ1MzMsImV4cCI6MjA5MDcwMDUzM30.-RPvOYMLzftubrpJ4KSVrqL2eNaopjty30_TrnkGpBo";

// Business Rules
const TAX_RATE = 7;              // 7% VAT
const POINTS_RATE = 10000;       // 1 point per 10,000 LAK

// Create Supabase client (SINGLE INSTANCE - no duplicate)
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Make constants available globally
window.TAX_RATE = TAX_RATE;
window.POINTS_RATE = POINTS_RATE;
