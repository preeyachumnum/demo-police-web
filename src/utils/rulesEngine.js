import { addDays, format } from 'date-fns';
import { th } from 'date-fns/locale';

export const getRequiredDocuments = (state) => {
  const docs = [];
  const { caseInfo, suspects, caseStage } = state;

  // 1. Offense Type Logic
  if (caseInfo.offenseType === 'drug') {
    docs.push({ id: 'drug_seizure', name: 'บันทึกตรวจยึดของกลาง (ยาเสพติด)', cat: 'offense' });
    docs.push({ id: 'drug_weight', name: 'ใบส่งตรวจน้ำหนัก', cat: 'offense' });
    docs.push({ id: 'drug_forensic', name: 'ใบรายงานผลพิสูจน์นิติเคมี', cat: 'offense' });
  } else if (caseInfo.offenseType === 'fraud') {
    docs.push({ id: 'fraud_statement', name: 'สเตทเมนต์เส้นทางการเงิน', cat: 'offense' });
    docs.push({ id: 'fraud_log', name: 'บันทึกข้อมูลจราจรคอมพิวเตอร์ (Log)', cat: 'offense' });
    docs.push({ id: 'fraud_chat', name: 'หลักฐานการสนทนา (แชท)', cat: 'offense' });
  } else {
    docs.push({ id: 'general_standard', name: 'ชุดเอกสารมาตรฐานทั่วไป', cat: 'offense' });
  }

  // 2. Suspect Status Logic (Generate per suspect)
  suspects.forEach((suspect, index) => {
    const suspectPrefix = `ผู้ต้องหาคนที่ ${index + 1} (${suspect.name || 'ไม่ได้ระบุชื่อ'})`;
    if (suspect.status === 'walk_in') {
      docs.push({ id: `charge_${suspect.id}`, name: `${suspectPrefix}: บันทึกการแจ้งข้อกล่าวหา`, cat: 'suspect' });
    } else if (suspect.status === 'escaped') {
      docs.push({ id: `warrant_${suspect.id}`, name: `${suspectPrefix}: คำร้องขอออกหมายจับ`, cat: 'suspect' });
    } else if (suspect.status === 'arrested') {
      docs.push({ id: `arrest_${suspect.id}`, name: `${suspectPrefix}: บันทึกการจับกุม`, cat: 'suspect' });
      docs.push({ id: `custody_${suspect.id}`, name: `${suspectPrefix}: คำร้องขอผัดฟ้อง/ฝากขัง`, cat: 'suspect' });
    }
  });

  // 3. Stage-based Filter
  if (caseStage === 'complaint') {
    docs.push({ id: 'stage_complaint', name: 'ใบแจ้งความ / บันทึกประจำวัน', cat: 'stage' });
    docs.push({ id: 'stage_testimony', name: 'บันทึกคำให้การเบื้องต้น (พยาน/ผู้กล่าวหา)', cat: 'stage' });
  } else if (caseStage === 'investigation') {
    docs.push({ id: 'stage_evidence', name: 'หนังสือขอพยานหลักฐานจากหน่วยงานภายนอก', cat: 'stage' });
  } else if (caseStage === 'warrant') {
    docs.push({ id: 'stage_summons', name: 'คำร้องขอออกหมายเรียก / หมายจับ', cat: 'stage' });
  } else if (caseStage === 'summary') {
    docs.push({ id: 'stage_summary', name: 'แบบฟอร์มสรุปสำนวนส่งพนักงานอัยการ', cat: 'stage' });
  }

  return docs;
};

// 4. Date Calculation Logic
export const calculateDeadlines = (arrestDate, courtMode) => {
  if (!arrestDate) return null;
  const start = new Date(arrestDate);
  const deadlines = [];

  if (courtMode === 'provincial_10y') {
    // 7 ฝาก ฝากละ 12 วัน
    for (let i = 1; i <= 7; i++) {
        let date = addDays(start, (i * 12) - 1); // วันที่ 1 คือวันที่จับ
        deadlines.push({ round: i, name: `ฝากที่ ${i}`, date: format(date, 'dd MMM yyyy', { locale: th }) });
    }
  } else if (courtMode === 'provincial_3y') {
    // 4 ฝาก ฝากละ 12 วัน
    for (let i = 1; i <= 4; i++) {
        let date = addDays(start, (i * 12) - 1);
        deadlines.push({ round: i, name: `ฝากที่ ${i}`, date: format(date, 'dd MMM yyyy', { locale: th }) });
    }
  } else if (courtMode === 'municipal') {
    // 5 ผัด ผัดละ 6 วัน (เริ่มนับวันที่แจ้งข้อหา)
    for (let i = 1; i <= 5; i++) {
        let date = addDays(start, (i * 6) - 1);
        deadlines.push({ round: i, name: `ผัดที่ ${i}`, date: format(date, 'dd MMM yyyy', { locale: th }) });
    }
  }

  return deadlines;
};
