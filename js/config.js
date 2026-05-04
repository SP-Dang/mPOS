// =====================================================
// mPOS PRODUCTION - CONFIGURATION
// =====================================================

// Supabase Configuration - REPLACE WITH YOUR NEW PROJECT CREDENTIALS
// Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
const SUPABASE_URL = 'https://rcjvgyetkukyaexzskmg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjanZneWV0a3VreWFleHpza21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzQ2MzUsImV4cCI6MjA5MzQ1MDYzNX0.aNTyK0l1sOYpZ0TdGrmjxIQbafnujQb1hP6dENX_104';

// Business Rules
const TAX_RATE = 7;              // 7% VAT
const POINTS_RATE = 10000;       // 1 point per 10,000 LAK
const POINTS_VALUE = 1000;       // 1 point = 1,000 LAK redemption
const SESSION_TIMEOUT = 30;      // Auto logout after 30 minutes inactive

// Display Settings
const TERMINAL_ID = 'main-terminal';
const CURRENCY = '₭';
const LAO_LOCALE = 'lo-LA';

// Export for use in other files
window.AppConfig = {
    SUPABASE_URL,
    SUPABASE_KEY,
    TAX_RATE,
    POINTS_RATE,
    POINTS_VALUE,
    SESSION_TIMEOUT,
    TERMINAL_ID,
    CURRENCY,
    LAO_LOCALE
};
