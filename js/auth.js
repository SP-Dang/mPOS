// =====================================================
// mPOS PRODUCTION - AUTHENTICATION
// =====================================================

let currentUser = null;

// Initialize Supabase client
const supabase = supabase.createClient(AppConfig.SUPABASE_URL, AppConfig.SUPABASE_KEY);

// Get current user
function getCurrentUser() {
    return {
        id: localStorage.getItem('lsm_user_id'),
        name: localStorage.getItem('lsm_user_name'),
        role: localStorage.getItem('lsm_role'),
        username: localStorage.getItem('lsm_username')
    };
}

// Login function
async function login(username, pin) {
    try {
        // Get staff record
        const { data: staff, error } = await supabase
            .from('pos_staff')
            .select('id, username, full_name, role')
            .eq('username', username)
            .single();
        
        if (error || !staff) {
            showToast('ຊື່ຜູ້ໃຊ້ບໍ່ຖືກຕ້ອງ', 'error');
            return false;
        }
        
        // Demo PIN check (in production, use hashed PINs)
        // GM PIN: 9999, Cashier PIN: 1111
        const validPin = (staff.role === 'GM' && pin === '9999') || 
                         (staff.role !== 'GM' && pin === '1111');
        
        if (!validPin) {
            showToast('ລະຫັດ PIN ບໍ່ຖືກຕ້ອງ', 'error');
            return false;
        }
        
        currentUser = staff;
        localStorage.setItem('lsm_user_id', staff.id);
        localStorage.setItem('lsm_user_name', staff.full_name);
        localStorage.setItem('lsm_role', staff.role);
        localStorage.setItem('lsm_username', staff.username);
        
        showToast(`ສະບາຍດີ ${staff.full_name}`, 'success');
        
        // Update last login
        await supabase
            .from('pos_staff')
            .update({ last_login: new Date().toISOString() })
            .eq('id', staff.id);
        
        // Redirect based on role
        if (staff.role === 'GM' || staff.role === 'MANAGER') {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'pos-checkout.html';
        }
        
        return true;
    } catch (err) {
        console.error('Login error:', err);
        showToast('ເກີດຂໍ້ຜິດພາດ', 'error');
        return false;
    }
}

// Logout function
function logout() {
    confirmAction('ຕ້ອງການອອກຈາກລະບົບ?', () => {
        localStorage.clear();
        currentUser = null;
        showToast('ອອກຈາກລະບົບສຳເລັດ', 'info');
        setTimeout(() => window.location.href = 'login.html', 500);
    });
}

// Check if user is authenticated
function checkAuth(requiredRole = null) {
    const userId = localStorage.getItem('lsm_user_id');
    const role = localStorage.getItem('lsm_role');
    
    if (!userId) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredRole && role !== requiredRole && role !== 'GM') {
        showToast(`ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້ານີ້`, 'error');
        window.location.href = 'pos-checkout.html';
        return false;
    }
    
    return true;
}
