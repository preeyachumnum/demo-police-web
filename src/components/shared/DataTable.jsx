import React from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

const DataTable = ({
  title,
  columns,     // [{ key, label, render? }]
  data,        // array of objects
  onAdd,
  onEdit,
  onDelete,
  addLabel = 'เพิ่ม',
  emptyMessage = 'ยังไม่มีข้อมูล',
}) => {
  return (
    <div className="data-table-container">
      <div className="data-table-header">
        {title && <h3 className="data-table-title">{title}</h3>}
        {onAdd && (
          <button className="btn btn-primary btn-sm" onClick={onAdd}>
            <Plus size={16} /> {addLabel}
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <div className="data-table-empty">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
                {(onEdit || onDelete) && <th style={{ width: '100px' }}>จัดการ</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="text-muted">{index + 1}</td>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(item) : item[col.key] || '-'}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td>
                      <div className="table-actions">
                        {onEdit && (
                          <button
                            className="btn-icon"
                            onClick={() => onEdit(item)}
                            title="แก้ไข"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="btn-icon btn-icon-danger"
                            onClick={() => onDelete(item)}
                            title="ลบ"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataTable;
