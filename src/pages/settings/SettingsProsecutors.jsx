import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import DataTable from '../../components/shared/DataTable';
import FormField from '../../components/shared/FormField';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { Briefcase, X, Save } from 'lucide-react';

const emptyProsecutor = {
  name: '',
  type: '',
  address: '',
  phone: '',
};

const prosecutorTypes = [
  { value: 'provincial', label: 'อัยการจังหวัด' },
  { value: 'juvenile', label: 'อัยการคดีเยาวชนและครอบครัว' },
  { value: 'tax', label: 'อธิบดีอัยการ สำนักงานคดีภาษีอากร' },
  { value: 'other', label: 'อื่นๆ' },
];

const SettingsProsecutors = () => {
  const { prosecutors, saveProsecutor, deleteProsecutor } = useSettings();
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleChange = (e) => {
    setEditing(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    saveProsecutor(editing);
    setEditing(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteProsecutor(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns = [
    { key: 'name', label: 'ชื่อสำนักงานอัยการ' },
    {
      key: 'type',
      label: 'ประเภท',
      render: (item) => {
        const t = prosecutorTypes.find(p => p.value === item.type);
        return t ? t.label : item.type;
      },
    },
    { key: 'phone', label: 'โทร' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <Briefcase size={24} className="page-icon" />
        <div>
          <h2>ตั้งค่าอัยการ</h2>
          <p className="text-muted">STEP 0.2 — สำนักงานอัยการปลายทางสำหรับส่งสำนวน</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={prosecutors}
        onAdd={() => setEditing({ ...emptyProsecutor })}
        onEdit={(item) => setEditing({ ...item })}
        onDelete={(item) => setDeleteTarget(item)}
        addLabel="เพิ่มอัยการ"
        emptyMessage="ยังไม่ได้เพิ่มข้อมูลอัยการ"
      />

      {editing && (
        <div className="dialog-overlay" onClick={() => setEditing(null)}>
          <div className="dialog-content" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>{editing.id ? 'แก้ไขอัยการ' : 'เพิ่มอัยการใหม่'}</h3>
              <button className="dialog-close" onClick={() => setEditing(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="dialog-body">
              <FormField
                label="ชื่อสำนักงานอัยการ"
                name="name"
                value={editing.name}
                onChange={handleChange}
                placeholder="เช่น อัยการจังหวัดนนทบุรี"
                required
              />
              <FormField
                label="ประเภท"
                name="type"
                type="select"
                options={prosecutorTypes}
                value={editing.type}
                onChange={handleChange}
                required
              />
              <FormField
                label="ที่อยู่"
                name="address"
                type="textarea"
                rows={2}
                value={editing.address}
                onChange={handleChange}
              />
              <FormField
                label="โทรศัพท์"
                name="phone"
                value={editing.phone}
                onChange={handleChange}
              />
            </div>
            <div className="dialog-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(null)}>ยกเลิก</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={!editing.name || !editing.type}>
                <Save size={16} /> บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="ลบข้อมูลอัยการ"
        message={`ต้องการลบ "${deleteTarget?.name}" ใช่หรือไม่?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default SettingsProsecutors;
