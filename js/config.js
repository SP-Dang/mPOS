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

// Offline Mode Configuration
window.OFFLINE_MODE = {
    enabled: true,
    syncInterval: 30000, // Sync every 30 seconds when online
    lastSync: null,
    pendingSales: []
};

// IndexedDB Setup for offline storage
const OFFLINE_DB_NAME = 'mPOS_Offline';
const OFFLINE_DB_VERSION = 1;

function openOfflineDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // Store for offline products
            if (!db.objectStoreNames.contains('products')) {
                db.createObjectStore('products', { keyPath: 'barcode' });
            }
            
            // Store for pending sales
            if (!db.objectStoreNames.contains('pending_sales')) {
                const saleStore = db.createObjectStore('pending_sales', { keyPath: 'id', autoIncrement: true });
                saleStore.createIndex('created_at', 'created_at');
            }
            
            // Store for customers
            if (!db.objectStoreNames.contains('customers')) {
                db.createObjectStore('customers', { keyPath: 'phone' });
            }
        };
    });
}

// Save products offline
async function cacheProductsOffline() {
    if (!navigator.onLine) return;
    
    try {
        const { data } = await window.supabaseClient
            .from('pos_products')
            .select('*');
        
        const db = await openOfflineDB();
        const tx = db.transaction(['products'], 'readwrite');
        const store = tx.objectStore('products');
        
        // Clear old cache
        store.clear();
        
        // Add new products
        data.forEach(product => {
            store.put(product);
        });
        
        await tx.done;
        console.log('✅ Products cached offline');
    } catch (err) {
        console.error('Offline cache error:', err);
    }
}
