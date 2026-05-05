// =====================================================
// AUTHENTICATION - SHARED ACROSS ALL PAGES
// =====================================================

// Staff data
const STAFF_LIST = {
    cashier1: { id: "26295c52-0994-4ce3-8cb1-cf09e0371e0a", username: "cashier1", full_name: "Somphone", role: "CASHIER", pin: "1111" },
    gm: { id: "acb923c1-ffda-4a17-a77e-96b667298ee2", username: "gm", full_name: "General Manager", role: "GM", pin: "9999" }
};

// Login function
async function loginWithPin(username, pin) {
    const staff = STAFF_LIST[username];
    
    if (!staff) {
        showToast('ຊື່ຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ', 'error');
        return false;
    }
    
    if (staff.pin !== pin) {
        showToast('PIN ບໍ່ຖືກຕ້ອງ', 'error');
        return false;
    }
    
    localStorage.setItem('lsm_user_id', staff.id);
    localStorage.setItem('lsm_user_name', staff.full_name);
    localStorage.setItem('lsm_role', staff.role);
    localStorage.setItem('lsm_username', staff.username);
    
    showToast(`ສະບາຍດີ ${staff.full_name}`, 'success');
    
    setTimeout(() => {
        if (staff.role === 'GM') {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'pos-checkout.html';
        }
    }, 500);
    
    return true;
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

// Check authentication
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

// Add this function to auth.js
async function setRLSContext(role) {
    try {
        // Call the Supabase function to set the role for RLS
        const { error } = await window.supabaseClient.rpc('set_app_role', { 
            role_name: role 
        });
        if (error) console.error('RLS role error:', error);
        else console.log('✅ RLS context set:', role);
    } catch (err) {
        console.error('Failed to set RLS context:', err);
    }
}
