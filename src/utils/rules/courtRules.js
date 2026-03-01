// ============================================================
// Court Rules — Court suggestion & detention limits
// ============================================================
import { COURT_TYPES, DETENTION_RULES } from '../../lib/constants';

/**
 * suggestCourt — Suggest court type based on max penalty and suspect age.
 */
export function suggestCourtType(maxPenaltyYears, suspectAge = null) {
  // Juvenile: age < 18
  if (suspectAge !== null && suspectAge < 18) {
    return COURT_TYPES.JUVENILE;
  }

  // Municipal: max penalty ≤ 3 years or fine-only
  if (maxPenaltyYears <= 3) {
    return COURT_TYPES.MUNICIPAL;
  }

  // Provincial: default
  return COURT_TYPES.PROVINCIAL;
}

/**
 * getDetentionLimits — Get detention limits for a court type and penalty.
 */
export function getDetentionLimits(courtType, maxPenaltyYears = 0) {
  switch (courtType) {
    case COURT_TYPES.PROVINCIAL:
      return maxPenaltyYears > 10
        ? DETENTION_RULES.PROVINCIAL_HIGH
        : DETENTION_RULES.PROVINCIAL_MID;

    case COURT_TYPES.MUNICIPAL:
      return DETENTION_RULES.MUNICIPAL;

    case COURT_TYPES.JUVENILE:
      return maxPenaltyYears <= 5
        ? DETENTION_RULES.JUVENILE_LOW
        : DETENTION_RULES.JUVENILE_HIGH;

    default:
      return DETENTION_RULES.PROVINCIAL_MID;
  }
}

/**
 * isCourtOpen — Check if a court is open on a given date.
 */
export function isCourtOpen(court, date) {
  const d = new Date(date);
  const day = d.getDay();

  // Sunday always closed
  if (day === 0) return false;

  // Saturday: check if open
  if (day === 6) {
    return court?.saturdayOpen === true;
  }

  // Weekday: check custom holidays
  if (court?.holidays) {
    const holidayList = court.holidays.split(',').map(s => s.trim());
    const dateStr = d.toISOString().split('T')[0];
    if (holidayList.includes(dateStr)) return false;
  }

  return true;
}

/**
 * getSuggestedCourtLabel — Human-readable court suggestion reason.
 */
export function getSuggestedCourtLabel(courtType, reason) {
  const labels = {
    [COURT_TYPES.PROVINCIAL]: 'ศาลจังหวัด',
    [COURT_TYPES.MUNICIPAL]: 'ศาลแขวง',
    [COURT_TYPES.JUVENILE]: 'ศาลเยาวชนและครอบครัว',
  };
  return `แนะนำ: ${labels[courtType] || courtType}${reason ? ` (${reason})` : ''}`;
}
