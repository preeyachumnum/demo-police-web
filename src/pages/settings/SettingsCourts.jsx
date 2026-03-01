import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import DataTable from '../../components/shared/DataTable';
import FormField from '../../components/shared/FormField';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { Scale, X, Save } from 'lucide-react';
import { COURT_TYPES, COURT_TYPE_LABELS } from '../../lib/constants';

const emptyCourt = {
  name: '',
  type: '',
  address: '',
  phone: '',
  workingHoursStart: '08:30',
  workingHoursEnd: '16:30',
  saturdayOpen: false,
  saturdayStart: '08:30',
  saturdayEnd: '12:00',
  allowWeekendDetention: false,
  holidays: '',
};

const SettingsCourts = () => {
  const { courts, saveCourt, deleteCourt } = useSettings();
  const [editing, setEditing] = useState(null); // null = closed, object = editing
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditing(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    saveCourt(editing);
    setEditing(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteCourt(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns = [
    { key: 'name', label: 'ชื่อศาล' },
    {
      key: 'type',
      label: 'ประเภท',
      render: (item) => COURT_TYPE_LABELS[item.type] || item.type,
    },
    { key: 'phone', label: 'โทร' },
    {
      key: 'allowWeekendDetention',
      label: 'ฝากขังวันหยุด',
      render: (item) => item.allowWeekendDetention ? '✅' : '❌',
    },
  ];

  const courtTypeOptions = Object.entries(COURT_TYPE_LABELS).map(([value, label]) => ({
    value, label
  }));

  return (
    <div className="page-content">
      <div className="page-header">
        <Scale size={24} className="page-icon" />
        <div>
          <h2>ตั้งค่าศาล</h2>
          <p className="text-muted">STEP 0.2 — ศาลที่ใช้ในการฝากขัง/ผัดฟ้อง</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={courts}
        onAdd={() => setEditing({ ...emptyCourt })}
        onEdit={(item) => setEditing({ ...item })}
        onDelete={(item) => setDeleteTarget(item)}
        addLabel="เพิ่มศาล"
        emptyMessage="ยังไม่ได้เพิ่มข้อมูลศาล กรุณากดปุ่ม 'เพิ่มศาล'"
      />

      {/* Edit Modal */}
      {editing && (
        <div className="dialog-overlay" onClick={() => setEditing(null)}>
          <div className="dialog-content dialog-lg" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <h3>{editing.id ? 'แก้ไขศาล' : 'เพิ่มศาลใหม่'}</h3>
              <button className="dialog-close" onClick={() => setEditing(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="dialog-body">
              <FormField
                label="ชื่อศาล"
                name="name"
                value={editing.name}
                onChange={handleChange}
                placeholder="เช่น ศาลจังหวัดนนทบุรี"
                required
              />
              <FormField
                label="ประเภทศาล"
                name="type"
                type="select"
                options={courtTypeOptions}
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

              <hr className="divider" />
              <h4 className="sub-section-title">เวลาทำการ</h4>

              <div className="form-row">
                <FormField
                  label="เปิด"
                  name="workingHoursStart"
                  type="time"
                  value={editing.workingHoursStart}
                  onChange={handleChange}
                />
                <FormField
                  label="ปิด"
                  name="workingHoursEnd"
                  type="time"
                  value={editing.workingHoursEnd}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="saturdayOpen"
                    checked={editing.saturdayOpen || false}
                    onChange={handleChange}
                  />
                  <span>เสาร์เปิดเฉพาะฝากขังครั้งที่ 1</span>
                </label>
              </div>

              {editing.saturdayOpen && (
                <div className="form-row">
                  <FormField
                    label="เสาร์เปิด"
                    name="saturdayStart"
                    type="time"
                    value={editing.saturdayStart}
                    onChange={handleChange}
                  />
                  <FormField
                    label="เสาร์ปิด"
                    name="saturdayEnd"
                    type="time"
                    value={editing.saturdayEnd}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="allowWeekendDetention"
                    checked={editing.allowWeekendDetention || false}
                    onChange={handleChange}
                  />
                  <span>Allow Weekend Detention (อนุญาตฝากขังวันหยุด)</span>
                </label>
              </div>

              <FormField
                label="วันหยุดเพิ่มเติม (เฉพาะศาลนี้)"
                name="holidays"
                type="textarea"
                rows={2}
                value={editing.holidays}
                onChange={handleChange}
                hint="ระบุวันที่คั่นด้วยเครื่องหมาย , เช่น 2568-01-01, 2568-04-13"
              />
            </div>

            <div className="dialog-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(null)}>
                ยกเลิก
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSave}
                disabled={!editing.name || !editing.type}
              >
                <Save size={16} /> บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="ลบข้อมูลศาล"
        message={`ต้องการลบ "${deleteTarget?.name}" ใช่หรือไม่?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default SettingsCourts;
