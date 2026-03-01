import React from 'react';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options,      // for select: [{ value, label }]
  rows,         // for textarea
  disabled = false,
  error,
  hint,
  children,     // for custom content
}) => {
  const id = `field-${name}`;

  const renderInput = () => {
    if (children) return children;

    if (type === 'select' && options) {
      return (
        <select
          id={id}
          name={name}
          className={`form-select ${error ? 'form-error' : ''}`}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">-- เลือก --</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          name={name}
          className={`form-control ${error ? 'form-error' : ''}`}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 3}
          disabled={disabled}
        />
      );
    }

    return (
      <input
        id={id}
        name={name}
        type={type}
        className={`form-control ${error ? 'form-error' : ''}`}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  };

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {renderInput()}
      {hint && <p className="form-hint">{hint}</p>}
      {error && <p className="form-error-text">{error}</p>}
    </div>
  );
};

export default FormField;
