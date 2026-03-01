import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import DataTable from '../../components/shared/DataTable';
import FormField from '../../components/shared/FormField';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { FileText, X, Save } from 'lucide-react';
import { OFFENSE_CATEGORIES } from '../../lib/constants';

const categoryLabels = {
  drug: 'ยาเสพติด',
  fraud: 'ฉ้อโกง/คอมพิวเตอร์',
  firearm: 'อาวุธปืน',
  e_cigarette: 'บุหรี่ไฟฟ้า',
  general: 'ทั่วไป',
};

const categoryOptions = Object.entries(categoryLabels).map(([value, label]) => ({
  value, label,
}));

const emptyCharge = {
  name: '',
  legalText: '',
  laws: '',
  maxPenaltyYears: '',
  category: '',
};

const SettingsCharges = () => {
  const { chargeTemplates, saveChargeTemplate, deleteChargeTemplate } = useSettings();
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleChange = (e) => {
    setEditing(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const toSave = {
      ...editing,
      laws: typeof editing.laws === 'string'
        ? editing.laws.split(',').map(s => s.trim()).filter(Boolean)
        : editing.laws,
      maxPenaltyYears: Number(editing.maxPenaltyYears) || 0,
    };
    saveChargeTemplate(toSave);
    setEditing(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteChargeTemplate(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleEdit = (item) => {
    setEditing({
      ...item,
      laws: Array.isArray(item.laws) ? item.laws.join(', ') : item.laws || '',
    });
  };

  const columns = [
    { key: 'name', label: 'ชื่อข้อหา' },
    {
      key: 'category',
      label: 'หมวด',
      render: (item) => categoryLabels[item.category] || item.category,
    },
    {
      key: 'maxPenaltyYears',
      label: 'โทษสูงสุด (ปี)',
      render: (item) => item.maxPenaltyYears ? `${item.maxPenaltyYears} ปี` : '-',
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <FileText size={24} className="page-icon" />
        <div>
          <h2>ข้อหาสำเร็จรูป</h2>
          <p className="text-muted">STEP 0.3 — ใช้สำหรับเลือกเร็วตอนตั้งข้อหา + สร้างข้อหาใหม่ได้</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={chargeTemplates}
        onAdd={() => setEditing({ ...emptyCharge })}
        onEdit={handleEdit}
        onDelete={(item) => setDeleteTarget(item)}
        addLabel="สร้างข้อหาใหม่"
        emptyMessage="ยังไม่มีข้อหาสำเร็จรูป (ข้อมูลเริ่มต้นจะถูกโหลดอัตโนมัติ)"
      />

      {editing && (
        <div className="dialog-overlay" onClick={() => setEditing(null)}>
          <div className="dialog-content dialog-lg" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>{editing.id ? 'แก้ไขข้อหา' : 'สร้างข้อหาใหม่'}</h3>
              <button className="dialog-close" onClick={() => setEditing(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="dialog-body">
              <FormField
                label="ชื่อข้อหา (ชื่อย่อ)"
                name="name"
                value={editing.name}
                onChange={handleChange}
                placeholder="เช่น มียาบ้าไว้ครอบครองเพื่อจำหน่าย"
                required
              />
              <FormField
                label="ถ้อยคำข้อหาตามกฎหมาย"
                name="legalText"
                type="textarea"
                rows={2}
                value={editing.legalText}
                onChange={handleChange}
                placeholder="ข้อความเต็มตามตัวบทกฎหมาย"
                required
              />
              <FormField
                label="กฎหมาย / มาตราที่อ้าง"
                name="laws"
                type="textarea"
                rows={2}
                value={editing.laws}
                onChange={handleChange}
                placeholder="คั่นด้วยเครื่องหมาย , เช่น พ.ร.บ.ยาเสพติด ม.15, ม.66 วรรค 2"
                hint="ใส่หลายมาตราโดยคั่นด้วย ,"
              />
              <div className="form-row">
                <FormField
                  label="โทษสูงสุด (จำนวนปี)"
                  name="maxPenaltyYears"
                  type="number"
                  value={editing.maxPenaltyYears}
                  onChange={handleChange}
                  placeholder="เช่น 10"
                  required
                />
                <FormField
                  label="หมวดคดี"
                  name="category"
                  type="select"
                  options={categoryOptions}
                  value={editing.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="dialog-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(null)}>ยกเลิก</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSave}
                disabled={!editing.name || !editing.legalText || !editing.maxPenaltyYears}
              >
                <Save size={16} /> บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="ลบข้อหา"
        message={`ต้องการลบ "${deleteTarget?.name}" ใช่หรือไม่?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default SettingsCharges;
