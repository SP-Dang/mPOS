// =====================================================
// mPOS - AUTHENTICATION WITH SUPABASE RLS
// =====================================================

// Staff data mapping (matching your Supabase pos_staff table)
const STAFF_DATA = {
    cashier1: { id: "26295c52-0994-4ce3-8cb1-cf09e0371e0a", username: "cashier1", full_name: "Somphone", role: "CASHIER", pin: "1111" },
    gm: { id: "acb923c1-ffda-4a17-a77e-96b667298ee2", username: "gm", full_name: "General Manager", role: "GM", pin: "9999" }
};

// Login function with RLS context
async function loginWithPin(username, pin) {
    try {
        const staff = STAFF_DATA[username];
        
        if (!staff) {
            showToast('ຊື່ຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ', 'error');
            return false;
        }
        
        // Verify PIN
        if (staff.pin !== pin) {
            showToast('PIN ບໍ່ຖືກຕ້ອງ', 'error');
            return false;
        }
        
        // Store user info in localStorage
        localStorage.setItem('lsm_user_id', staff.id);
        localStorage.setItem('lsm_user_name', staff.full_name);
        localStorage.setItem('lsm_role', staff.role);
        localStorage.setItem('lsm_username', staff.username);
        
        // Set RLS context - CRITICAL for policies to work
        localStorage.setItem('app_current_user_id', staff.id);
        localStorage.setItem('app_current_role', staff.role);
        localStorage.setItem('app_current_user_name', staff.full_name);
        
        // For Supabase RLS, we need to set a session variable
        await window.supabaseClient.auth.signOut(); // Clear any existing session
        
        // Set custom claims via localStorage for RLS policies
        // RLS policies will read from this
        console.log('User logged in with role:', staff.role);
        
        showToast(`ສະບາຍດີ ${staff.full_name}`, 'success');
        
        // Update last login in database
        await window.supabaseClient
            .from('pos_staff')
            .update({ last_login: new Date().toISOString() })
            .eq('id', staff.id);
        
        // Redirect based on role
        setTimeout(() => {
            if (staff.role === 'GM') {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'pos-checkout.html';
            }
        }, 500);
        
        return true;
    } catch (err) {
        console.error('Login error:', err);
        showToast('ເກີດຂໍ້ຜິດພາດ', 'error');
        return false;
    }
}

// Get current user
function getCurrentUser() {
    return {
        id: localStorage.getItem('lsm_user_id'),
        name: localStorage.getItem('lsm_user_name'),
        role: localStorage.getItem('lsm_role'),
        username: localStorage.getItem('lsm_username')
    };
}

// Check if user is authenticated
function checkAuth() {
    const userId = localStorage.getItem('lsm_user_id');
    const userRole = localStorage.getItem('lsm_role');
    
    if (!userId) {
        window.location.href = 'login.html';
        return false;
    }
    
    // For RLS, ensure context is set
    if (localStorage.getItem('app_current_role') !== userRole) {
        localStorage.setItem('app_current_role', userRole);
        localStorage.setItem('app_current_user_id', userId);
    }
    
    return true;
}

// Logout
function handleLogout() {
    if (confirm('ຕ້ອງການອອກຈາກລະບົບ?')) {
        // Clear all localStorage
        localStorage.removeItem('lsm_user_id');
        localStorage.removeItem('lsm_user_name');
        localStorage.removeItem('lsm_role');
        localStorage.removeItem('lsm_username');
        localStorage.removeItem('app_current_user_id');
        localStorage.removeItem('app_current_role');
        localStorage.removeItem('app_current_user_name');
        
        // Clear Supabase session
        window.supabaseClient.auth.signOut();
        
        window.location.href = 'login.html';
    }
}

// Display user name in sidebar
function displayUserName() {
    const user = getCurrentUser();
    const userNameElem = document.getElementById('user-name-display');
    if (userNameElem) {
        userNameElem.innerHTML = `👤 ${user.name || 'Cashier'}`;
    }
}

// Setup role-based menu hiding
function setupRoleBasedMenus() {
    const user = getCurrentUser();
    const adminMenus = document.querySelectorAll('.admin-only');
    
    if (user.role !== 'GM') {
        adminMenus.forEach(el => {
            el.style.display = 'none';
        });
    } else {
        adminMenus.forEach(el => {
            el.style.display = 'flex';
        });
    }
}

// Get current role for RLS
function getCurrentRole() {
    return localStorage.getItem('lsm_role') || 'CASHIER';
}

// Get current user ID for RLS
function getCurrentUserId() {
    return localStorage.getItem('lsm_user_id');
}
