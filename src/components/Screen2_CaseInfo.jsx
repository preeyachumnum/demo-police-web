import React from 'react';
import { useCase } from '../context/CaseContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Screen2_CaseInfo = () => {
  const { state, updateState, nextStep, prevStep } = useCase();

  const handleChange = (e) => {
    updateState({
      caseInfo: {
        ...state.caseInfo,
        [e.target.name]: e.target.value
      }
    });
  };

  const isFormValid = state.caseInfo.offenseType && state.caseInfo.chargeDetails;

  return (
    <div className="p-6 fade-enter-active">
      <div className="stepper mb-6">
        <div className="step-indicator active"></div>
        <div className="step-indicator"></div>
        <div className="step-indicator"></div>
      </div>

      <div className="card">
        <h2 className="mb-6">ข้อมูลคดีเบื้องต้น (Step 1)</h2>
        
        <div className="form-group mb-6">
          <label className="form-label">ประเภทคดี (Offense Type) *</label>
          <div className="radio-card-grid">
            <label className="radio-card">
              <input 
                type="radio" 
                name="offenseType" 
                value="drug" 
                checked={state.caseInfo.offenseType === 'drug'} 
                onChange={handleChange} 
              />
              <div className="radio-card-content">
                <span className="radio-card-title">คดียาเสพติด</span>
                <span className="radio-card-desc">ต้องการใบตรวจน้ำหนักและรายงานผลพิสูจน์นิติเคมี</span>
              </div>
            </label>
            <label className="radio-card">
              <input 
                type="radio" 
                name="offenseType" 
                value="fraud" 
                checked={state.caseInfo.offenseType === 'fraud'} 
                onChange={handleChange} 
              />
              <div className="radio-card-content">
                <span className="radio-card-title">คดีฉ้อโกง / ออนไลน์ / พ.ร.บ.คอมฯ</span>
                <span className="radio-card-desc">ต้องการเส้นทางการเงิน และข้อมูลจราจรคอมพิวเตอร์</span>
              </div>
            </label>
            <label className="radio-card">
              <input 
                type="radio" 
                name="offenseType" 
                value="general" 
                checked={state.caseInfo.offenseType === 'general'} 
                onChange={handleChange} 
              />
              <div className="radio-card-content">
                <span className="radio-card-title">คดีทั่วไป (ลักทรัพย์, ทำร้ายร่างกาย ฯลฯ)</span>
                <span className="radio-card-desc">ชุดเอกสารมาตรฐาน</span>
              </div>
            </label>
          </div>
        </div>

        <div className="form-group mb-6">
          <label className="form-label">ฐานความผิด (โดยย่อ) *</label>
          <input 
            type="text" 
            className="form-control" 
            name="chargeDetails"
            placeholder="เช่น มียาบ้าไว้ในครอบครองเพื่อจำหน่าย"
            value={state.caseInfo.chargeDetails}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <button className="btn btn-primary" onClick={nextStep} disabled={!isFormValid}>
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

export default Screen2_CaseInfo;
