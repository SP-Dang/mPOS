// js/audit.js - Audit logging helper

async function logAudit(action, tableName, recordId, oldData, newData, additionalInfo = {}) {
    try {
        const user = getCurrentUser();
        
        // Get IP address (simple version - you can also fetch from backend)
        let ipAddress = localStorage.getItem('user_ip') || '0.0.0.0';
        
        const auditData = {
            action: action,           // 'DISCOUNT_APPLIED', 'PRODUCT_UPDATED', etc.
            table_name: tableName,    // 'pos_sales', 'pos_products', etc.
            record_id: recordId,       // Sale ID or product ID
            user_name: user?.name || 'Unknown',
            old_data: oldData,
            new_data: newData,
            ip_address: ipAddress,
            created_at: new Date().toISOString()
        };
        
        // Also add any additional info
        if (Object.keys(additionalInfo).length > 0) {
            auditData.old_data = { ...oldData, ...additionalInfo };
        }
        
        const { error } = await window.supabaseClient
            .from('pos_audit_log')
            .insert([auditData]);
        
        if (error) {
            console.error('Audit log error:', error);
            // Don't throw - audit logging shouldn't break the main flow
        }
        
        return true;
    } catch (err) {
        console.error('Failed to log audit:', err);
        return false;
    }
}

// Specific audit functions
async function logDiscountApplied(saleId, originalTotal, discountAmount, discountReason, finalTotal) {
    return await logAudit(
        'DISCOUNT_APPLIED',
        'pos_sales',
        saleId,
        { total_amount: originalTotal, discount_amount: 0 },
        { 
            total_amount: finalTotal, 
            discount_amount: discountAmount,
            discount_reason: discountReason,
            discount_percentage: ((discountAmount / originalTotal) * 100).toFixed(2) + '%'
        },
        { discount_reason: discountReason }
    );
}

async function logProductUpdate(productId, oldData, newData) {
    return await logAudit(
        'PRODUCT_UPDATED',
        'pos_products',
        productId,
        oldData,
        newData
    );
}

async function logStockAdjustment(productId, oldStock, newStock, reason) {
    return await logAudit(
        'STOCK_ADJUSTED',
        'pos_products',
        productId,
        { stock_qty: oldStock },
        { stock_qty: newStock, adjustment_reason: reason }
    );
}

async function logRefundProcessed(saleId, refundAmount, itemsRefunded) {
    return await logAudit(
        'REFUND_PROCESSED',
        'pos_sales',
        saleId,
        { status: 'COMPLETED' },
        { status: 'REFUNDED', refund_amount: refundAmount, items_refunded: itemsRefunded }
    );
}

async function logBulkUpload(tableName, recordsCount, successCount, errorCount) {
    return await logAudit(
        'BULK_UPLOAD',
        tableName,
        null,
        null,
        { 
            records_total: recordsCount,
            records_success: successCount,
            records_failed: errorCount,
            timestamp: new Date().toISOString()
        }
    );
}
