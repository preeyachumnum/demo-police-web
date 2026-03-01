import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, variant = 'danger' }) => {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <button className="dialog-close" onClick={onCancel}>
          <X size={20} />
        </button>

        <div className="dialog-icon">
          <AlertTriangle size={32} color={variant === 'danger' ? 'var(--danger)' : 'var(--warning)'} />
        </div>

        <h3 className="dialog-title">{title || 'ยืนยันการดำเนินการ'}</h3>
        <p className="dialog-message">{message || 'คุณต้องการดำเนินการนี้ใช่หรือไม่?'}</p>

        <div className="dialog-actions">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>
            ยกเลิก
          </button>
          <button
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'} btn-sm`}
            onClick={onConfirm}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
