import React, { useState, useEffect } from 'react';
import { useCase } from '../context/CaseContext';
import { ShieldAlert, ArrowRight, Save, Trash2, FileEdit } from 'lucide-react';

const Screen1_Welcome = () => {
  const { nextStep, resetData, loadDraft, deleteDraft } = useCase();
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDate, setDraftDate] = useState(null);

  useEffect(() => {
    const draft = localStorage.getItem('policeWebDraft');
    if (draft) {
      setHasDraft(true);
      const parsed = JSON.parse(draft);
      if (parsed.savedAt) {
         setDraftDate(new Date(parsed.savedAt).toLocaleString('th-TH'));
      }
    }
  }, []);

  const handleLoadDraft = () => {
     loadDraft();
  };

  const handleDeleteDraft = () => {
     if (deleteDraft()) {
        setHasDraft(false);
     }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center" style={{ flex: 1 }}>
      <div className="card w-full" style={{ textAlign: 'center', maxWidth: '400px' }}>
        <ShieldAlert size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
        <h2 className="mb-4 text-main">ระบบจัดการเอกสารสำนวนคดี</h2>
        <p className="text-muted mb-6" style={{ fontSize: '0.875rem' }}>
          ยินดีต้อนรับเข้าสู่ระบบสร้างเอกสารกฎหมายอัตโนมัติ 
          ระบบนี้ทำงานบนเครื่องของคุณ (Client-Side) ทั้งหมด 
          <b style={{ color: 'var(--danger)', display: 'block', marginTop: '0.5rem' }}>
            ไม่มีการเก็บข้อมูลส่วนบุคคลของผู้เสียหาย หรือผู้ต้องหาลงในฐานข้อมูลส่วนกลาง
          </b>
        </p>

        {hasDraft ? (
          <div className="mb-6 p-4" style={{ backgroundColor: 'var(--warning-light)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
            <h3 className="mb-2 flex items-center gap-2" style={{ color: 'var(--warning)', fontSize: '1rem' }}><Save size={18} /> พบแบบร่างที่บันทึกไว้</h3>
            {draftDate && <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>บันทึกเมื่อ: {draftDate}</p>}
            
            <div className="flex gap-2">
              <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} onClick={handleLoadDraft}>
                <FileEdit size={16} /> ทำต่อจากแบบร่าง
              </button>
              <button className="btn btn-danger" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} onClick={handleDeleteDraft}>
                <Trash2 size={16} /> ลบแบบร่าง
              </button>
            </div>
          </div>
        ) : (
          <p className="text-muted mb-6" style={{ fontSize: '0.875rem' }}>
            ระบบจะทำการบันทึกข้อมูลแบบร่างไว้ในเครื่องคอมพิวเตอร์ของคุณอัตโนมัติขณะกรอกข้อมูล
          </p>
        )}

        <button className="btn btn-secondary" onClick={() => { resetData(); nextStep(); }}>
          {hasDraft ? "เริ่มต้นใหม่ (ล้างข้อมูลเก่า)" : "เริ่มต้นใช้งาน"} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Screen1_Welcome;
