import React from 'react';

const variants = {
  success: { bg: 'var(--success-light)', color: 'var(--success)', border: 'rgba(5,150,105,0.2)' },
  warning: { bg: 'var(--warning-light)', color: 'var(--warning)', border: 'rgba(217,119,6,0.2)' },
  danger:  { bg: 'var(--danger-light)',  color: 'var(--danger)',  border: 'rgba(220,38,38,0.2)' },
  info:    { bg: 'var(--primary-light)', color: 'var(--primary)', border: 'rgba(79,70,229,0.2)' },
  neutral: { bg: 'var(--bg-color)',      color: 'var(--text-muted)', border: 'var(--border)' },
};

const StatusBadge = ({ variant = 'neutral', children, icon, size = 'md' }) => {
  const style = variants[variant] || variants.neutral;
  const sizeClass = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : '';

  return (
    <span
      className={`status-badge ${sizeClass}`}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
};

export default StatusBadge;
