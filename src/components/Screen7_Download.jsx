import React, { useRef, useState } from 'react';
import { useCase } from '../context/CaseContext';
import { getRequiredDocuments } from '../utils/rulesEngine';
import { ArrowLeft, Download, FileText, CheckCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const Screen7_Download = () => {
  const { state, prevStep, resetData } = useCase();
  const docs = getRequiredDocuments(state);
  const printRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    const element = printRef.current;
    const opt = {
      margin:       15,
      filename:     `police_docs_${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      setDone(true);
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 fade-enter-active">
      {!done ? (
        <div className="card text-center">
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', 
              backgroundColor: 'var(--success-light)', color: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <FileText size={40} />
            </div>
            <h2 className="mb-2">เอกสารพร้อมดาวน์โหลด</h2>
            <p className="text-muted">ระบบประมวลผลและเตรียมฟอร์มจำนวน {docs.length} รายการเสร็จสิ้น</p>
          </div>

          <button 
            className="btn btn-primary mb-4" 
            onClick={handleDownload} 
            disabled={isGenerating}
            style={{ padding: '1rem', fontSize: '1.1rem' }}
          >
            {isGenerating ? 'กำลังสร้างไฟล์ PDF...' : (
              <><Download size={20} /> ดาวน์โหลด PDF ทั้งหมดชุดเดียว</>
            )}
          </button>

          <button className="btn btn-secondary mt-4" onClick={prevStep} disabled={isGenerating}>
            <ArrowLeft size={18} /> กลับไปแก้ไขข้อมูล
          </button>
        </div>
      ) : (
        <div className="card text-center">
          <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 className="mb-4">ดาวน์โหลดสำเร็จ!</h2>
          <p className="text-muted mb-6" style={{ fontSize: '0.95rem' }}>ไฟล์ PDF ถูกบันทึกลงในเครื่องของคุณเรียบร้อยแล้ว<br/>คุณสามารถกลับไปแก้ไขข้อมูลเพื่อสร้างเอกสารใหม่ หรือ เริ่มคดีใหม่</p>
          <div className="flex flex-col gap-3">
            <button className="btn btn-secondary" onClick={() => setDone(false)}>
              <ArrowLeft size={18} /> กลับไปแก้ไขข้อมูล (แบบร่างยังอยู่)
            </button>
            <button className="btn btn-primary" onClick={resetData}>
              เริ่มสร้างสำนวนคดีใหม่ (ล้างข้อมูลเก่า)
            </button>
          </div>
        </div>
      )}

      {/* Hidden Print Template Render */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={printRef} style={{ width: '210mm', padding: '20mm', backgroundColor: 'white', color: 'black', fontFamily: 'Sarabun' }}>
          {/* Cover Page */}
          <div style={{ textAlign: 'center', marginBottom: '40px', pageBreakAfter: 'always' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>หน้าปกสำนวนคดี (สร้างอัตโนมัติ)</h1>
            <p style={{ fontSize: '18px' }}>หน่วยงาน: {state.caseInfo.policeStation || 'ไม่ได้ระบุ'}</p>
            <p style={{ fontSize: '18px' }}>พนักงานสอบสวน: {state.caseInfo.investigatorName || 'ไม่ได้ระบุ'}</p>
            <p style={{ fontSize: '18px' }}>ประเภทคดี: {
               state.caseInfo.offenseType === 'drug' ? 'ยาเสพติด' : 
               state.caseInfo.offenseType === 'fraud' ? 'คดีฉ้อโกง/ออนไลน์' : 'คดีทั่วไป'
            }</p>
            <p style={{ fontSize: '18px' }}>ฐานความผิด: {state.caseInfo.chargeDetails}</p>
          </div>

          {/* Dynamic Documents List */}
          {docs.map((doc, idx) => (
            <div key={idx} style={{ pageBreakAfter: 'always', padding: '10px' }}>
               <h2 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '30px' }}>{doc.name}</h2>
               <div style={{ fontSize: '16px', lineHeight: '2' }}>
                 <p><b>เขียนที่:</b> {state.caseInfo.policeStation}</p>
                 <p><b>วัน เดือน ปี:</b> ..............................................................</p>
                 <br/>
                 <p>คดีนี้เป็นเรื่องเกี่ยวกับ: {state.caseInfo.chargeDetails}</p>
                 <p>พนักงานสอบสวนรับผิดชอบ: {state.caseInfo.investigatorName}</p>
                 <br/>
                 <h3>รายชื่อผู้ต้องหาในคดี:</h3>
                 <ul>
                   {state.suspects.map(s => (
                     <li key={s.id}>
                        {s.name} (เลขบัตรประชาชน: {s.idCard || '-'}) <br/>
                        ที่อยู่: {s.address || '-'} <br/>
                        สถานะ: {
                          s.status === 'walk_in' ? 'มาพบด้วยตนเอง' : 
                          s.status === 'escaped' ? 'หลบหนี' : 'ถูกจับกุมแล้ว'
                        }
                     </li>
                   ))}
                 </ul>
                 <br/><br/><br/><br/>
                 <div style={{ textAlign: 'right' }}>
                    <p>ลงชื่อ ..................................................... พนักงานสอบสวน</p>
                    <p>({state.caseInfo.investigatorName || '.....................................................'})</p>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Screen7_Download;
