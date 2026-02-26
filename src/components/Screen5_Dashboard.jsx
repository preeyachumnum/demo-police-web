import React, { useState } from 'react';
import { useCase } from '../context/CaseContext';
import { ArrowLeft, ArrowRight, FileCheck, Calendar, DownloadCloud } from 'lucide-react';
import { getRequiredDocuments, calculateDeadlines } from '../utils/rulesEngine';

const Screen5_Dashboard = () => {
  const { state, updateState, nextStep, prevStep } = useCase();
  const docs = getRequiredDocuments(state);

  const [arrestDate, setArrestDate] = useState('');
  const [courtMode, setCourtMode] = useState('provincial_10y');
  const [deadlines, setDeadlines] = useState([]);

  // Check if any suspect is arrested for date calculation
  const hasArrested = state.suspects.some(s => s.status === 'arrested');

  const handleCalculate = () => {
    if (arrestDate) {
       const result = calculateDeadlines(arrestDate, courtMode);
       setDeadlines(result);
    }
  };

  return (
    <div className="p-6 fade-enter-active">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-main" style={{ fontSize: '1.25rem' }}>Dashboard 📌สรุปผลรูปคดี</h2>
      </div>

      {hasArrested && (
        <div className="card" style={{ borderColor: 'var(--warning)', backgroundColor: 'var(--warning-light)' }}>
          <h3 className="mb-4 flex items-center gap-2" style={{ color: 'var(--warning)' }}>
            <Calendar size={20} /> ระบบคำนวณวันฝากขัง / ผัดฟ้อง
          </h3>
          <div className="form-group mb-4">
            <label className="form-label">อำนาจศาลและอัตราโทษ</label>
            <select className="form-select mb-4" value={courtMode} onChange={e => setCourtMode(e.target.value)}>
              <option value="provincial_10y">ศาลจังหวัด (โทษจำคุก 10 ปีขึ้นไป) - 7 ฝาก</option>
              <option value="provincial_3y">ศาลจังหวัด (โทษจำคุก 3-10 ปี) - 4 ฝาก</option>
              <option value="municipal">ศาลแขวง (จำคุกไม่เกิน 3 ปี) - 5 ผัด</option>
            </select>
            <label className="form-label">วันที่จับกุม / วันแจ้งข้อหา</label>
            <input 
              type="date" 
              className="form-control mb-4" 
              value={arrestDate} 
              onChange={e => setArrestDate(e.target.value)} 
            />
            <button className="btn btn-secondary" onClick={handleCalculate} disabled={!arrestDate}>คำนวณ</button>
          </div>

          {deadlines.length > 0 && (
            <div style={{ background: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <h4 className="mb-2">กำหนดการครบฝากขัง:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {deadlines.map((d, i) => (
                  <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <b>{d.name}:</b> ครบกำหนดวันที่ {d.date}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h3 className="mb-4 flex items-center gap-2" style={{ color: 'var(--success)' }}>
          <FileCheck size={20} /> รายการเอกสารที่ต้องใช้ (Checklist)
        </h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {docs.map((doc, idx) => (
            <li key={idx} style={{ 
              padding: '0.75rem', 
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <input type="checkbox" defaultChecked style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--primary)' }} />
              <span style={{ fontSize: '0.95rem' }}>{doc.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button className="btn btn-primary" onClick={nextStep} style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '600' }}>
          ไปหน้าสร้างเอกสารอัตโนมัติ <DownloadCloud size={20} />
        </button>
        <button className="btn btn-secondary" onClick={prevStep} style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}>
          <ArrowLeft size={18} /> กลับไปแก้ไขข้อมูล
        </button>
      </div>
    </div>
  );
};

export default Screen5_Dashboard;
