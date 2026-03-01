import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import DataTable from '../../components/shared/DataTable';
import FormField from '../../components/shared/FormField';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { Building, X, Save } from 'lucide-react';
import { AGENCY_TYPE_LABELS } from '../../lib/constants';

const emptyAgency = {
  name: '',
  type: '',
  address: '',
  phone: '',
  contactPerson: '',
};

const SettingsAgencies = () => {
  const { agencies, saveAgency, deleteAgency } = useSettings();
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleChange = (e) => {
    setEditing(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    saveAgency(editing);
    setEditing(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteAgency(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const agencyTypeOptions = Object.entries(AGENCY_TYPE_LABELS).map(([value, label]) => ({
    value, label,
  }));

  const columns = [
    { key: 'name', label: 'ชื่อหน่วยงาน' },
    {
      key: 'type',
      label: 'ประเภท',
      render: (item) => AGENCY_TYPE_LABELS[item.type] || item.type,
    },
    { key: 'contactPerson', label: 'ผู้ติดต่อ' },
    { key: 'phone', label: 'โทร' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <Building size={24} className="page-icon" />
        <div>
          <h2>ตั้งค่าหน่วยนอก</h2>
          <p className="text-muted">STEP 0.2 — หน่วยงานภายนอกที่ต้องส่งตรวจ/ขอข้อมูล</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={agencies}
        onAdd={() => setEditing({ ...emptyAgency })}
        onEdit={(item) => setEditing({ ...item })}
        onDelete={(item) => setDeleteTarget(item)}
        addLabel="เพิ่มหน่วยนอก"
        emptyMessage="ยังไม่ได้เพิ่มข้อมูลหน่วยนอก"
      />

      {editing && (
        <div className="dialog-overlay" onClick={() => setEditing(null)}>
          <div className="dialog-content" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>{editing.id ? 'แก้ไขหน่วยนอก' : 'เพิ่มหน่วยนอกใหม่'}</h3>
              <button className="dialog-close" onClick={() => setEditing(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="dialog-body">
              <FormField
                label="ชื่อหน่วยงาน"
                name="name"
                value={editing.name}
                onChange={handleChange}
                placeholder="เช่น ศูนย์พิสูจน์หลักฐาน 1"
                required
              />
              <FormField
                label="ประเภท"
                name="type"
                type="select"
                options={agencyTypeOptions}
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
                label="ผู้ติดต่อ"
                name="contactPerson"
                value={editing.contactPerson}
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
        title="ลบข้อมูลหน่วยนอก"
        message={`ต้องการลบ "${deleteTarget?.name}" ใช่หรือไม่?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default SettingsAgencies;
