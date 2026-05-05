// =====================================================
// mPOS - AUTHENTICATION WITH SUPABASE RLS
// =====================================================

// Staff data mapping (matching your Supabase pos_staff table)
const STAFF_DATA = {
    cashier1: { id: "26295c52-0994-4ce3-8cb1-cf09e0371e0a", username: "cashier1", full_name: "Somphone", role: "CASHIER", pin: "1111" },
    gm: { id: "acb923c1-ffda-4a17-a77e-96b667298ee2", username: "gm", full_name: "General Manager", role: "GM", pin: "9999" }
};

// Set RLS Context (with error handling)
async function setRLSContext(role, userId) {
    try {
        // Check if supabaseClient exists
        if (!window.supabaseClient) {
            console.error('❌ supabaseClient not initialized!');
            return;
        }
        
        // Try to set the role (function may not exist yet, that's OK)
        try {
            await window.supabaseClient.rpc('set_app_role', { role_name: role });
            console.log('✅ Role set:', role);
        } catch (e) {
            console.log('Note: set_app_role function not yet created in Supabase');
        }
        
        try {
            await window.supabaseClient.rpc('set_app_user_id', { user_id: userId });
            console.log('✅ User ID set:', userId);
        } catch (e) {
            console.log('Note: set_app_user_id function not yet created in Supabase');
        }
        
        console.log('✅ RLS context configured:', { role, userId });
    } catch (err) {
        console.error('RLS context error:', err);
    }
}

// Login function
async function loginWithPin(username, pin) {
    try {
        const staff = STAFF_DATA[username];
        
        if (!staff) {
            showToast('ຊື່ຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ', 'error');
            return false;
        }
        
        if (staff.pin !== pin) {
            showToast('PIN ບໍ່ຖືກຕ້ອງ', 'error');
            return false;
        }
        
        // Store user info
        localStorage.setItem('lsm_user_id', staff.id);
        localStorage.setItem('lsm_user_name', staff.full_name);
        localStorage.setItem('lsm_role', staff.role);
        localStorage.setItem('lsm_username', staff.username);
        localStorage.setItem('app_current_user_id', staff.id);
        localStorage.setItem('app_current_role', staff.role);
        
        // Set RLS context (non-blocking - don't wait for it)
        setRLSContext(staff.role, staff.id);
        
        console.log('User logged in:', staff.full_name, 'Role:', staff.role);
        showToast(`ສະບາຍດີ ${staff.full_name}`, 'success');
        
        // Update last login in database (optional, can fail silently)
        try {
            await window.supabaseClient
                .from('pos_staff')
                .update({ last_login: new Date().toISOString() })
                .eq('id', staff.id);
        } catch (err) {
            console.log('Could not update last login:', err);
        }
        
        // Redirect
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
    if (!userId) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout
function handleLogout() {
    if (confirm('ຕ້ອງການອອກຈາກລະບົບ?')) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Display user name in sidebar
function displayUserName() {
    const user = getCurrentUser();
    const elem = document.getElementById('user-name-display');
    if (elem) {
        elem.innerHTML = `👤 ${user.name || 'Cashier'}`;
    }
}

// Setup role-based menu hiding
function setupRoleBasedMenus() {
    const user = getCurrentUser();
    if (user.role !== 'GM') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
}
