// =====================================================
// SUPABASE CONFIGURATION - SHARED ACROSS ALL PAGES
// =====================================================

const SUPABASE_URL = "https://rcjvgyetkukyaexzskmg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjanZneWV0a3VreWFleHpza21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzQ2MzUsImV4cCI6MjA5MzQ1MDYzNX0.aNTyK0l1sOYpZ0TdGrmjxIQbafnujQb1hP6dENX_104";

// Create Supabase client (global)
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Business Rules
window.TAX_RATE = 7;
window.POINTS_RATE = 6667;      // ~6,667 LAK = 1 point (20,000 LAK = 3 points)
window.POINTS_VALUE = 100;       // 1 point = 100 LAK discount (100 points = 10,000 LAK)

console.log('✅ Config loaded');
