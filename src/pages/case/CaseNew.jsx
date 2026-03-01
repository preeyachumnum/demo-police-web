import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCase } from '../../context/CaseContext';
import FormField from '../../components/shared/FormField';
import { CASE_TYPES, CASE_TYPE_LABELS } from '../../lib/constants';
import { FolderPlus, ArrowRight } from 'lucide-react';

const caseTypeOptions = Object.entries(CASE_TYPE_LABELS).map(([value, label]) => ({ value, label }));

const CaseNew = () => {
  const navigate = useNavigate();
  const { createCase } = useCase();

  const [form, setForm] = useState({
    caseType: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    summary: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.caseType) errs.caseType = 'กรุณาเลือกประเภทคดี';
    if (!form.incidentDate) errs.incidentDate = 'กรุณาระบุวันเกิดเหตุ';
    if (!form.summary) errs.summary = 'กรุณากรอกสรุปเรื่อง';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newCase = createCase(form);
    if (newCase) {
      navigate(`/case/${newCase.id}`);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <FolderPlus size={24} className="page-icon" />
        <div>
          <h2>เปิดคดีใหม่</h2>
          <p className="text-muted">PHASE 1 — กรอกข้อมูลเบื้องต้นของเหตุการณ์</p>
        </div>
      </div>

      <div className="section-card">
        <FormField
          label="ประเภทคดี"
          name="caseType"
          type="select"
          options={caseTypeOptions}
          value={form.caseType}
          onChange={handleChange}
          required
          error={errors.caseType}
        />

        <div className="form-row">
          <FormField
            label="วันเกิดเหตุ"
            name="incidentDate"
            type="date"
            value={form.incidentDate}
            onChange={handleChange}
            required
            error={errors.incidentDate}
          />
          <FormField
            label="เวลาเกิดเหตุ"
            name="incidentTime"
            type="time"
            value={form.incidentTime}
            onChange={handleChange}
          />
        </div>

        <FormField
          label="สถานที่เกิดเหตุ"
          name="incidentLocation"
          value={form.incidentLocation}
          onChange={handleChange}
          placeholder="ระบุสถานที่เกิดเหตุโดยละเอียด"
        />

        <FormField
          label="สรุปเรื่อง"
          name="summary"
          type="textarea"
          rows={4}
          value={form.summary}
          onChange={handleChange}
          placeholder="อธิบายเหตุการณ์โดยสรุป..."
          required
          error={errors.summary}
        />

        <button className="btn btn-primary w-full mt-6" onClick={handleSubmit}>
          <ArrowRight size={18} /> สร้างคดีและดำเนินการต่อ
        </button>
      </div>
    </div>
  );
};

export default CaseNew;
