// ============================================================
// Document Rules — Determines required documents per case state
// ============================================================
import { SUSPECT_STATUSES, TRACKS, DOC_STATUSES } from '../../lib/constants';

/**
 * getRequiredDocuments(caseData)
 * Returns a list of document items with name, status, and category.
 * Append-only: changing suspect status adds docs, never removes.
 */
export function getRequiredDocuments(caseData) {
  const docs = [];
  const add = (name, category = 'general', required = true) => {
    // Avoid duplicates
    if (!docs.find(d => d.name === name)) {
      const existing = (caseData.documents || []).find(d => d.name === name);
      docs.push({
        id: existing?.id || crypto.randomUUID(),
        name,
        category,
        required,
        status: existing?.status || DOC_STATUSES.PENDING,
      });
    }
  };

  // --- Always required ---
  add('บันทึกคำให้การผู้กล่าวหา', 'statement');
  add('บันทึกคำให้การพยาน', 'statement');

  // --- Based on charges ---
  if (caseData.charges?.length > 0) {
    add('บันทึกคำให้การผู้ต้องหา', 'statement');
  }

  // --- Based on suspect status ---
  const status = caseData.suspectStatus;

  if (status === SUSPECT_STATUSES.DETENTION || status === SUSPECT_STATUSES.CHARGE_DETAIN) {
    // Track: ฝากขัง
    add('บันทึกจับกุม', 'arrest');
    add('บันทึกรับตัวผู้ต้องหา', 'arrest');
    add('บันทึกแจ้งข้อกล่าวหา', 'arrest');
    add('บันทึกแจ้งสิทธิ', 'arrest');
    add('บัญชีของกลาง', 'evidence');
    add('คำร้องขอฝากขัง', 'detention');
    add('หนังสือนำตัวผู้ต้องหาไปศาล', 'detention');
    add('หนังสือนำส่งพนักงานอัยการ', 'sending');
  }

  if (status === SUSPECT_STATUSES.BAIL || status === SUSPECT_STATUSES.CHARGE_RELEASE) {
    // Track: ประกัน
    add('สัญญาประกันตัว', 'bail');
    add('บันทึกปล่อยตัวผู้ต้องหา', 'bail');
  }

  if (status === SUSPECT_STATUSES.NOT_CAUGHT || status === SUSPECT_STATUSES.UNKNOWN) {
    // Track: หมายเรียก/หมายจับ
    add('หมายเรียกครั้งที่ 1', 'summons');
    add('ซองจดหมายหมายเรียกครั้งที่ 1', 'summons');
    add('หนังสือนำส่งหมายเรียกครั้งที่ 1', 'summons');
    add('หมายเรียกครั้งที่ 2', 'summons');
    add('ซองจดหมายหมายเรียกครั้งที่ 2', 'summons');
    add('หนังสือนำส่งหมายเรียกครั้งที่ 2', 'summons');
  }

  if (status === SUSPECT_STATUSES.ORAL_PROSECUTION) {
    add('หนังสือฟ้องวาจา', 'oral');
  }

  if (status === SUSPECT_STATUSES.REHABILITATION) {
    add('หนังสือส่งผู้ต้องหาเข้าฟื้นฟู', 'rehab');
  }

  // --- Based on charge categories ---
  const categories = (caseData.charges || []).map(c => c.category);

  if (categories.includes('drug')) {
    add('ผลตรวจสารเสพติด', 'external');
  }
  if (categories.includes('firearm')) {
    add('ผลตรวจอาวุธปืน', 'external');
    add('หนังสือนายทะเบียนอาวุธปืน', 'external');
  }
  if (categories.includes('e_cigarette')) {
    add('หนังสือกรมศุลกากร', 'external');
  }

  // --- Investigation summary ---
  if (caseData.investigation) {
    add('รายงานการสอบสวน', 'investigation');
    add('บันทึกความเห็นพนักงานสอบสวน', 'investigation');
  }

  // --- Final pack ---
  add('ปกสำนวน', 'final');
  add('สารบัญ', 'final');

  return docs;
}

/**
 * getDocumentsByCategory(docs)
 * Group documents by category for display.
 */
export function getDocumentsByCategory(docs) {
  const groups = {};
  const categoryLabels = {
    statement: '📋 คำให้การ',
    arrest: '🔴 เอกสารจับกุม',
    detention: '⛓️ เอกสารฝากขัง',
    bail: '🟡 เอกสารประกัน',
    summons: '🔵 หมายเรียก/จับ',
    evidence: '📦 ทรัพย์/ของกลาง',
    external: '🏢 หน่วยนอก',
    oral: '⚖️ ฟ้องวาจา',
    rehab: '🏥 ฟื้นฟู',
    investigation: '📝 สรุปสำนวน',
    sending: '📤 ส่งอัยการ',
    final: '📁 สำนวน',
    general: '📄 ทั่วไป',
  };

  for (const doc of docs) {
    const cat = doc.category || 'general';
    if (!groups[cat]) {
      groups[cat] = { label: categoryLabels[cat] || cat, docs: [] };
    }
    groups[cat].docs.push(doc);
  }
  return groups;
}
