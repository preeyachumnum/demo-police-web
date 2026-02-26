import React from 'react';
import { useCase } from '../context/CaseContext';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';

const Screen6_DocsGen = () => {
  const { state, updateState, nextStep, prevStep } = useCase();
  const suspects = state.suspects;

  const updateSuspect = (id, field, value) => {
    updateState({
      suspects: suspects.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const handleIdCardChange = (id, value) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length > 13) return;
    
    let formatted = '';
    for (let i = 0; i < digitsOnly.length; i++) {
        if (i === 1 || i === 5 || i === 10 || i === 12) {
            formatted += '-';
        }
        formatted += digitsOnly[i];
    }
    updateSuspect(id, 'idCard', formatted);
  };

  const handleCaseInfoChange = (e) => {
    updateState({
      caseInfo: { ...state.caseInfo, [e.target.name]: e.target.value }
    });
  };

  const isFormValid = suspects.every(s => s.name && s.idCard?.length === 17) && state.caseInfo.policeStation;

  return (
    <div className="p-6 fade-enter-active">
      <div className="card">
        <h2 className="mb-6">ข้อมูลส่วนบุคคลสำหรับสร้างเอกสาร (Step 4)</h2>
        
        <div className="form-group mb-6">
          <label className="form-label">ชื่อสถานีตำรวจ / หน่วยงาน *</label>
          <input 
            type="text" 
            className="form-control" 
            name="policeStation"
            placeholder="เช่น สภ.เมือง หรือ บก.ปอท."
            value={state.caseInfo.policeStation || ''}
            onChange={handleCaseInfoChange}
          />
        </div>

        <div className="form-group mb-6">
          <label className="form-label">ชื่อพนักงานสอบสวน</label>
          <input 
            type="text" 
            className="form-control" 
            name="investigatorName"
            placeholder="ยศ ชื่อ นามสกุล"
            value={state.caseInfo.investigatorName || ''}
            onChange={handleCaseInfoChange}
          />
        </div>

        {suspects.map((suspect, index) => (
          <div key={suspect.id} className="mb-6 p-4" style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 className="text-main mb-4 flex items-center gap-2" style={{ fontSize: '1rem' }}>
              <User size={18} /> ข้อมูลผู้ต้องหาคนที่ {index + 1}
            </h3>

            <div className="form-group mb-4">
              <label className="form-label" style={{ fontWeight: 'normal' }}>ชื่อ-นามสกุล *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="นาย/นาง/นางสาว ..."
                value={suspect.name} 
                onChange={(e) => updateSuspect(suspect.id, 'name', e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label className="form-label" style={{ fontWeight: 'normal' }}>เลขประจำตัวประชาชน 13 หลัก *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="X-XXXX-XXXXX-XX-X"
                value={suspect.idCard || ''} 
                onChange={(e) => handleIdCardChange(suspect.id, e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label className="form-label" style={{ fontWeight: 'normal' }}>ที่อยู่ปัจจุบัน</label>
              <textarea 
                className="form-control" 
                rows="2"
                placeholder="บ้านเลขที่ หมู่ ซอย ถนน ตำบล อำเภอ จังหวัด"
                value={suspect.address || ''} 
                onChange={(e) => updateSuspect(suspect.id, 'address', e.target.value)}
              ></textarea>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-3 mt-8">
          <button className="btn btn-primary" onClick={nextStep} disabled={!isFormValid}>
            บันทึกและสร้างเอกสาร <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary" onClick={prevStep}>
            <ArrowLeft size={18} /> กลับ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Screen6_DocsGen;
