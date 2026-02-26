import React from 'react';
import { useCase } from '../context/CaseContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Screen4_CaseStage = () => {
  const { state, updateState, nextStep, prevStep } = useCase();

  const handleChange = (e) => {
    updateState({ caseStage: e.target.value });
  };

  const isValid = state.caseStage !== '';

  return (
    <div className="p-6 fade-enter-active">
      <div className="stepper mb-6">
        <div className="step-indicator"></div>
        <div className="step-indicator"></div>
        <div className="step-indicator active"></div>
      </div>

      <div className="card">
        <h2 className="mb-6">ขั้นตอนของคดี (Step 3)</h2>
        
        <div className="form-group mb-6">
          <label className="form-label">สถานะคดีปัจจุบัน *</label>
          <div className="radio-card-grid">
            <label className="radio-card">
              <input 
                type="radio" 
                name="caseStage" 
                value="complaint" 
                checked={state.caseStage === 'complaint'} 
                onChange={handleChange} 
              />
              <div className="radio-card-content">
                <span className="radio-card-title">ชั้นรับคำร้องทุกข์</span>
                <span className="radio-card-desc">เพิ่งมาแจ้งความ/ให้การเบื้องต้น</span>
              </div>
            </label>
            <label className="radio-card">
              <input 
                type="radio" 
                name="caseStage" 
                value="investigation" 
                checked={state.caseStage === 'investigation'} 
                onChange={handleChange} 
              />
              <div className="radio-card-content">
                <span className="radio-card-title">ชั้นสอบสวน</span>
                <span className="radio-card-desc">อยู่ระหว่างรวบรวมพยานหลักฐาน</span>
              </div>
            </label>
            <label className="radio-card">
              <input 
                type="radio" 
                name="caseStage" 
                value="warrant" 
                checked={state.caseStage === 'warrant'} 
                onChange={handleChange} 
              />
              <div className="radio-card-content">
                <span className="radio-card-title">ชั้นขอหมาย</span>
                <span className="radio-card-desc">เตรียมขอหมายเรียก/หมายจับ/หมายค้น</span>
              </div>
            </label>
            <label className="radio-card">
              <input 
                type="radio" 
                name="caseStage" 
                value="summary" 
                checked={state.caseStage === 'summary'} 
                onChange={handleChange} 
              />
              <div className="radio-card-content">
                <span className="radio-card-title">ชั้นสรุปสำนวน</span>
                <span className="radio-card-desc">สรุปความเห็นส่งพนักงานอัยการ</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button className="btn btn-primary" onClick={nextStep} disabled={!isValid}>
            ดูผลลัพธ์เอกสาร <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary" onClick={prevStep}>
            <ArrowLeft size={18} /> กลับ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Screen4_CaseStage;
