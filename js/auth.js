// =====================================================
// LSM POS - AUTHENTICATION
// =====================================================

// Get current user
function getCurrentUser() {
    return {
        id: localStorage.getItem('lsm_user_id'),
        name: localStorage.getItem('lsm_user_name'),
        role: localStorage.getItem('lsm_role'),
        username: localStorage.getItem('lsm_username')
    };
}

// Check if user is logged in
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
    const userNameElem = document.getElementById('user-name-display');
    if (userNameElem) {
        userNameElem.innerHTML = `👤 ${user.name || 'Cashier'}`;
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
