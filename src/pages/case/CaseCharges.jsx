import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { useSettings } from '../../context/SettingsContext';
import FormField from '../../components/shared/FormField';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { suggestCourtType, getSuggestedCourtLabel } from '../../utils/rules/courtRules';
import { getRequiredAgencies } from '../../utils/rules/externalAgencyRules';
import { Scale, Plus, Trash2, Search, Lightbulb } from 'lucide-react';

const CaseCharges = () => {
  const { currentCase, addCharge, removeCharge, updateCase } = useCase();
  const { chargeTemplates } = useSettings();

  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form, setForm] = useState({ name: '', legalText: '', laws: '', maxPenaltyYears: '', category: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!currentCase) return null;

  const charges = currentCase.charges || [];
  const maxPenalty = Math.max(0, ...charges.map(c => c.maxPenaltyYears || 0));

  // Filter charge templates by search
  const filteredTemplates = chargeTemplates.filter(t =>
    !searchText || t.name.includes(searchText) || t.legalText?.includes(searchText)
  );

  const handleSelectTemplate = (template) => {
    const charge = {
      name: template.name,
      legalText: template.legalText,
      laws: Array.isArray(template.laws) ? template.laws : [],
      maxPenaltyYears: template.maxPenaltyYears || 0,
      category: template.category || 'general',
    };
    addCharge(charge);

    // Auto-update suggested court + agency tasks
    const updatedCharges = [...charges, charge];
    const suggestedCourt = suggestCourtType(
      Math.max(...updatedCharges.map(c => c.maxPenaltyYears || 0))
    );
    const agencyTasks = getRequiredAgencies(updatedCharges);
    updateCase({
      suggestedCourtType: suggestedCourt,
      agencyTasks: [
        ...(currentCase.agencyTasks || []),
        ...agencyTasks.filter(t =>
          !(currentCase.agencyTasks || []).find(e => e.agencyType === t.agencyType)
        ),
      ],
    });

    setSearchText('');
  };

  const handleCustomSave = () => {
    if (!form.name || !form.maxPenaltyYears) return;
    const charge = {
      ...form,
      laws: form.laws.split(',').map(s => s.trim()).filter(Boolean),
      maxPenaltyYears: Number(form.maxPenaltyYears),
    };
    addCharge(charge);
    setForm({ name: '', legalText: '', laws: '', maxPenaltyYears: '', category: '' });
    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      removeCharge(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="case-sub-page">
      <h3 className="section-title"><Scale size={18} /> ตั้งข้อหา (Phase 2)</h3>

      {/* Current charges */}
      {charges.length > 0 && (
        <div className="section-card mb-4">
          <h4 className="sub-section-title">ข้อหาที่ตั้งแล้ว</h4>
          {charges.map((charge, idx) => (
            <div key={charge.id || idx} className="charge-item">
              <div className="charge-info">
                <strong>{idx + 1}. {charge.name}</strong>
                {charge.legalText && <p className="text-muted">{charge.legalText}</p>}
                {charge.laws?.length > 0 && (
                  <p className="charge-laws">{charge.laws.join(', ')}</p>
                )}
                <span className="charge-penalty">โทษสูงสุด {charge.maxPenaltyYears} ปี</span>
              </div>
              <button
                className="btn-icon btn-icon-danger"
                onClick={() => setDeleteTarget(charge)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {maxPenalty > 0 && (
            <div className="court-suggestion mt-4">
              <Lightbulb size={16} />
              <span>
                {getSuggestedCourtLabel(
                  suggestCourtType(maxPenalty),
                  `โทษสูงสุด ${maxPenalty} ปี`
                )}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Search & pick from templates */}
      <div className="section-card mb-4">
        <h4 className="sub-section-title">เลือกจากข้อหาสำเร็จรูป</h4>
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="พิมพ์ค้นหาข้อหา..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <div className="template-list">
          {filteredTemplates.slice(0, 8).map(t => (
            <button
              key={t.id}
              className="template-item"
              onClick={() => handleSelectTemplate(t)}
              disabled={charges.some(c => c.name === t.name)}
            >
              <span className="template-name">{t.name}</span>
              <span className="template-penalty">{t.maxPenaltyYears} ปี</span>
            </button>
          ))}
          {filteredTemplates.length === 0 && (
            <p className="text-muted text-center">ไม่พบข้อหาที่ค้นหา</p>
          )}
        </div>
      </div>

      {/* Custom charge form */}
      {!showForm ? (
        <button className="btn btn-secondary w-full" onClick={() => setShowForm(true)}>
          <Plus size={16} /> กรอกข้อหาเอง
        </button>
      ) : (
        <div className="section-card">
          <h4 className="sub-section-title">กรอกข้อหาเอง</h4>
          <FormField
            label="ชื่อข้อหา" name="name" value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            required
          />
          <FormField
            label="ถ้อยคำตามกฎหมาย" name="legalText" type="textarea" rows={2}
            value={form.legalText}
            onChange={e => setForm(p => ({ ...p, legalText: e.target.value }))}
          />
          <FormField
            label="กฎหมาย/มาตรา (คั่นด้วย ,)" name="laws"
            value={form.laws}
            onChange={e => setForm(p => ({ ...p, laws: e.target.value }))}
          />
          <div className="form-row">
            <FormField
              label="โทษสูงสุด (ปี)" name="maxPenaltyYears" type="number"
              value={form.maxPenaltyYears}
              onChange={e => setForm(p => ({ ...p, maxPenaltyYears: e.target.value }))}
              required
            />
            <FormField
              label="หมวด" name="category" type="select"
              options={[
                { value: 'general', label: 'ทั่วไป' },
                { value: 'drug', label: 'ยาเสพติด' },
                { value: 'fraud', label: 'ฉ้อโกง' },
                { value: 'firearm', label: 'อาวุธปืน' },
                { value: 'e_cigarette', label: 'บุหรี่ไฟฟ้า' },
              ]}
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            />
          </div>
          <div className="dialog-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>ยกเลิก</button>
            <button className="btn btn-primary btn-sm" onClick={handleCustomSave}
              disabled={!form.name || !form.maxPenaltyYears}>
              เพิ่มข้อหา
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="ลบข้อหา"
        message={`ลบ "${deleteTarget?.name}" ออกจากคดีนี้?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CaseCharges;
