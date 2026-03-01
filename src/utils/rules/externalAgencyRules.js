// ============================================================
// External Agency Rules — Required agencies by charge category
// ============================================================
import { AGENCY_TYPES, AGENCY_TASK_STATUSES } from '../../lib/constants';

/**
 * getRequiredAgencies — Returns agency tasks based on charge categories.
 */
export function getRequiredAgencies(charges = []) {
  const tasks = [];
  const categories = charges.map(c => c.category);
  const added = new Set();

  const add = (type, description) => {
    if (added.has(type)) return;
    added.add(type);
    tasks.push({
      id: crypto.randomUUID(),
      agencyType: type,
      description,
      status: AGENCY_TASK_STATUSES.REQUESTED,
      requestDate: null,
      receiveDate: null,
    });
  };

  if (categories.includes('drug')) {
    add(AGENCY_TYPES.DRUG_LAB, 'ส่งตรวจสารเสพติด');
  }

  if (categories.includes('firearm')) {
    add(AGENCY_TYPES.FIREARM_LAB, 'ส่งตรวจอาวุธปืน');
    add(AGENCY_TYPES.FIREARM_REGISTRY, 'ตรวจสอบทะเบียนอาวุธปืน');
  }

  if (categories.includes('e_cigarette')) {
    add(AGENCY_TYPES.CUSTOMS, 'ตรวจสอบข้อมูลกับกรมศุลกากร');
  }

  if (categories.includes('fraud')) {
    add(AGENCY_TYPES.BANK, 'ขอข้อมูลธุรกรรมทางการเงิน');
    add(AGENCY_TYPES.TELECOM, 'ขอข้อมูลการโทร/ข้อความ');
  }

  return tasks;
}
