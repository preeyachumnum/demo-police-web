import React from 'react';
import { useCase } from '../context/CaseContext';
import { ArrowLeft, ArrowRight, UserPlus, Trash2 } from 'lucide-react';

const Screen3_Suspects = () => {
  const { state, updateState, nextStep, prevStep } = useCase();
  const suspects = state.suspects;

  const addSuspect = () => {
    const newId = suspects.length > 0 ? Math.max(...suspects.map(s => s.id)) + 1 : 1;
    updateState({ suspects: [...suspects, { id: newId, name: '', status: '' }] });
  };

  const removeSuspect = (id) => {
    updateState({ suspects: suspects.filter(s => s.id !== id) });
  };

  const updateSuspect = (id, field, value) => {
    updateState({
      suspects: suspects.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const isValid = suspects.length > 0 && suspects.every(s => s.status);

  return (
    <div className="p-6 fade-enter-active">
      <div className="stepper mb-6">
        <div className="step-indicator"></div>
        <div className="step-indicator active"></div>
        <div className="step-indicator"></div>
      </div>

      <div className="card">
        <h2 className="mb-6">ข้อมูลผู้ต้องหา (Step 2)</h2>
        
        {suspects.map((suspect, index) => (
          <div key={suspect.id} className="mb-6 p-4" style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-main" style={{ fontSize: '1rem' }}>ผู้ต้องหาคนที่ {index + 1}</h3>
              {suspects.length > 1 && (
                <button onClick={() => removeSuspect(suspect.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="form-group mb-4">
              <label className="form-label" style={{ fontWeight: 'normal' }}>สถานะผู้ต้องหา *</label>
              <select 
                className="form-select" 
                value={suspect.status} 
                onChange={(e) => updateSuspect(suspect.id, 'status', e.target.value)}
              >
                <option value="">-- เลือกสถานะ --</option>
                <option value="walk_in">มาพบด้วยตนเอง (ไม่ต้องฝากขัง/หมายจับ)</option>
                <option value="escaped">หลบหนี (ขอออกหมายจับ)</option>
                <option value="arrested">ถูกจับกุมตัวแล้ว (ต้องผัดฟ้อง/ฝากขัง)</option>
              </select>
            </div>
          </div>
        ))}

        <button className="btn btn-secondary mb-6" onClick={addSuspect}>
          <UserPlus size={18} /> เพิ่มผู้ต้องหา
        </button>

        <div className="flex flex-col gap-3 mt-8">
          <button className="btn btn-primary" onClick={nextStep} disabled={!isValid}>
            ถัดไป <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary" onClick={prevStep}>
            <ArrowLeft size={18} /> กลับ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Screen3_Suspects;
