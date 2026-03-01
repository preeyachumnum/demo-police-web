// ============================================================
// Readiness Rules — Check case readiness for final pack
// ============================================================
import { DOC_STATUSES } from '../../lib/constants';
import { getRequiredDocuments } from './documentRules';

/**
 * checkReadiness — Returns readiness status for a case.
 */
export function checkReadiness(caseData) {
  const missing = [];
  const warnings = [];
  let completedCount = 0;

  // 1. Required documents check
  const requiredDocs = getRequiredDocuments(caseData).filter(d => d.required);
  for (const doc of requiredDocs) {
    if (doc.status === DOC_STATUSES.PENDING) {
      missing.push(`เอกสาร: ${doc.name}`);
    } else {
      completedCount++;
    }
  }

  // 2. Case number check
  if (!caseData.caseNumber && !caseData.caseNumberData) {
    missing.push('ยังไม่ออกเลขคดี (Phase 6)');
  }

  // 3. Complainant check
  if (!caseData.complainants?.length) {
    missing.push('ยังไม่มีข้อมูลผู้กล่าวหา');
  }

  // 4. Charges check
  if (!caseData.charges?.length) {
    missing.push('ยังไม่ตั้งข้อหา');
  }

  // 5. Investigation summary check
  if (!caseData.investigation) {
    warnings.push('ยังไม่มีสรุปสำนวน (Phase 9)');
  }

  // 6. Prosecutor check
  if (!caseData.prosecutor) {
    warnings.push('ยังไม่เลือกอัยการ (Phase 10)');
  }

  // 7. External agency tasks
  const pendingAgencies = (caseData.agencyTasks || []).filter(
    t => t.status !== 'attached'
  );
  if (pendingAgencies.length > 0) {
    warnings.push(`มี ${pendingAgencies.length} งานหน่วยนอกที่ยังไม่เสร็จ`);
  }

  const totalRequired = requiredDocs.length;
  const progress = totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0;

  return {
    ready: missing.length === 0,
    progress,
    completedCount,
    totalRequired,
    missing,
    warnings,
  };
}
