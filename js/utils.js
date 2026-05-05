// =====================================================
// UTILITIES - SHARED ACROSS ALL PAGES
// =====================================================

// Format currency in Lao Kip
function formatLAK(amount) {
    if (isNaN(amount) || amount === undefined || amount === null) return '₭0';
    return new Intl.NumberFormat('lo-LA').format(Math.round(amount)) + ' ₭';
}

// Show toast notification
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${colors[type] || colors.success};
        color: white;
        border-radius: 12px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Calculate cart totals
function calculateCartTotals(cart, taxRate = 7) {
    const subtotal = cart.reduce((sum, item) => sum + (item.retail_price * item.qty), 0);
    const tax = subtotal * taxRate / 100;
    const total = subtotal + tax;
    return { subtotal, tax, total };
}

// Generate invoice number
function generateInvoiceNumber() {
    const today = new Date();
    const dateStr = today.getFullYear().toString().slice(-2) + 
                   (today.getMonth() + 1).toString().padStart(2, '0') + 
                   today.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${dateStr}-${randomNum}`;
}

// Animation keyframes
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
