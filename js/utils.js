// =====================================================
// mPOS PRODUCTION - UTILITY FUNCTIONS
// =====================================================

// Format currency in Lao Kip
function formatLAK(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return '₭0';
    return new Intl.NumberFormat('lo-LA', { 
        style: 'currency', 
        currency: 'LAK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format number with commas
function formatNumber(num) {
    return new Intl.NumberFormat('lo-LA').format(num);
}

// Format datetime for Lao display
function formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleDateString('lo-LA', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show toast notification
function showToast(message, type = 'success', duration = 3000) {
    // Remove existing toasts
    const existing = document.querySelector('.toast-container');
    if (existing) existing.remove();
    
    const container = document.createElement('div');
    container.className = 'toast-container';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
    `;
    
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${colors[type] || colors.success};
        color: white;
        padding: 14px 20px;
        border-radius: 12px;
        margin-bottom: 10px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 250px;
        animation: slideIn 0.3s ease;
        font-family: inherit;
    `;
    
    toast.innerHTML = `<span style="font-size: 18px;">${icons[type] || '✅'}</span><span>${message}</span>`;
    container.appendChild(toast);
    document.body.appendChild(container);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => container.remove(), 300);
    }, duration);
}

// Show confirmation dialog
function confirmAction(message, onConfirm) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20000;
        backdrop-filter: blur(4px);
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 25px; width: 320px; text-align: center;">
            <p style="font-size: 16px; margin-bottom: 25px; color: #1e293b;">${message}</p>
            <div style="display: flex; gap: 12px;">
                <button id="confirm-yes" style="flex:1; background: #10b981; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer;">ຢືນຢັນ</button>
                <button id="confirm-no" style="flex:1; background: #f1f5f9; color: #475569; border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer;">ຍົກເລີກ</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirm-yes').onclick = () => {
        modal.remove();
        if (onConfirm) onConfirm();
    };
    document.getElementById('confirm-no').onclick = () => modal.remove();
}

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Generate simple ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Session management
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (window.location.pathname !== '/login.html' && !window.location.pathname.includes('login')) {
            showToast('ເວລາເຂົ້າໃຊ້ງານໝົດອາຍຸ', 'warning');
            localStorage.clear();
            setTimeout(() => window.location.href = 'login.html', 2000);
        }
    }, (AppConfig?.SESSION_TIMEOUT || 30) * 60 * 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    resetInactivityTimer();
    ['click', 'keypress', 'mousemove', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
    });
});
