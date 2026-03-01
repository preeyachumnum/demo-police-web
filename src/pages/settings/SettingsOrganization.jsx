import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import FormField from '../../components/shared/FormField';
import { Building2, Save, CheckCircle } from 'lucide-react';

const SettingsOrganization = () => {
  const { organization, saveOrganization } = useSettings();
  const [form, setForm] = useState({ ...organization });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveOrganization(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Building2 size={24} className="page-icon" />
        <div>
          <h2>ตั้งค่าหน่วยงาน</h2>
          <p className="text-muted">STEP 0.1 — ข้อมูลนี้จะถูกใช้ในหัวกระดาษเอกสารทุกใบ</p>
        </div>
      </div>

      <div className="section-card">
        <FormField
          label="ชื่อสถานีตำรวจ / หน่วยงาน"
          name="stationName"
          value={form.stationName}
          onChange={handleChange}
          placeholder="เช่น สถานีตำรวจภูธรเมืองนนทบุรี"
          required
        />
        <FormField
          label="ที่อยู่"
          name="address"
          type="textarea"
          rows={2}
          value={form.address}
          onChange={handleChange}
          placeholder="เลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
        />
        <FormField
          label="หมายเลขโทรศัพท์"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="0-XXXX-XXXX"
        />
        <FormField
          label="เลขหนังสือ"
          name="documentNumber"
          value={form.documentNumber}
          onChange={handleChange}
          placeholder="เช่น ตช 0026.XX/XXXX"
        />
        <FormField
          label="กองบังคับการ / กองบัญชาการ (บก./บช.)"
          name="bureau"
          value={form.bureau}
          onChange={handleChange}
          placeholder="เช่น บช.ภ.1 / บก.น.1"
        />

        <hr className="divider" />

        <FormField
          label="ชื่อ ผู้กำกับการ (ผกก.)"
          name="commanderName"
          value={form.commanderName}
          onChange={handleChange}
          placeholder="ยศ ชื่อ นามสกุล"
        />
        <FormField
          label="ชื่อ รอง ผู้กำกับการ (รอง ผกก.)"
          name="deputyName"
          value={form.deputyName}
          onChange={handleChange}
          placeholder="ยศ ชื่อ นามสกุล"
        />

        <button className="btn btn-primary mt-6" onClick={handleSave}>
          {saved ? (
            <><CheckCircle size={18} /> บันทึกสำเร็จ</>
          ) : (
            <><Save size={18} /> บันทึกข้อมูลหน่วยงาน</>
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsOrganization;
