// =====================================================
// mPOS - AUTHENTICATION (Simplified - Working Version)
// =====================================================

// Staff data
const STAFF_DATA = {
    cashier1: { id: "26295c52-0994-4ce3-8cb1-cf09e0371e0a", username: "cashier1", full_name: "Somphone", role: "CASHIER", pin: "1111" },
    gm: { id: "acb923c1-ffda-4a17-a77e-96b667298ee2", username: "gm", full_name: "General Manager", role: "GM", pin: "9999" }
};

// Login function
async function loginWithPin(username, pin) {
    console.log('Login attempt:', username);
    
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
        
        console.log('✅ Login successful:', staff.full_name);
        showToast(`ສະບາຍດີ ${staff.full_name}`, 'success');
        
        // Update last login (optional - ignore errors)
        if (window.supabaseClient) {
            try {
                await window.supabaseClient
                    .from('pos_staff')
                    .update({ last_login: new Date().toISOString() })
                    .eq('id', staff.id);
            } catch (err) {
                console.log('Note: Could not update last login');
            }
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

// Display user name
function displayUserName() {
    const user = getCurrentUser();
    const elem = document.getElementById('user-name-display');
    if (elem) {
        elem.innerHTML = `👤 ${user.name || 'Cashier'}`;
    }
}

// Setup role-based menus
function setupRoleBasedMenus() {
    const user = getCurrentUser();
    if (user.role !== 'GM') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
}
