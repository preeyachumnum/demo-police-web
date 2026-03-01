// ============================================================
// Deadline Rules — Detention / bail / summons deadlines
// ============================================================
import { DETENTION_RULES } from '../../lib/constants';

/**
 * Add days to a date, skipping holidays & weekends if needed.
 */
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addHours(date, hours) {
  const d = new Date(date);
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  return d;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Check if a date falls on a holiday (Thai BE date strings or Date objects).
 */
function isHoliday(date, holidays = []) {
  const d = new Date(date);
  const dateStr = formatDateBE(d);
  return holidays.includes(dateStr);
}

function isWeekend(date) {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Format date to Thai BE string (YYYY-MM-DD where YYYY is พ.ศ.)
 */
function formatDateBE(date) {
  const d = new Date(date);
  const y = d.getFullYear() + 543;
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/**
 * Get the next working day (skip weekends and holidays).
 */
export function getNextWorkingDay(date, holidays = [], court = null) {
  let d = new Date(date);
  while (isWeekend(d) || isHoliday(d, holidays)) {
    // Exception: Saturday open for first detention (if court allows)
    if (d.getDay() === 6 && court?.saturdayOpen) {
      break;
    }
    d = addDays(d, 1);
  }
  return d;
}

/**
 * calculate48Hours — compute when 48h expires, considering court hours.
 * If 48h falls outside court hours or on holiday → extend to next working day.
 */
export function calculate48Hours(anchorDate, holidays = [], court = null) {
  const anchor = new Date(anchorDate);
  const expires = addHours(anchor, 48);

  // If expires outside court hours → push to next working day
  let deadline = getNextWorkingDay(expires, holidays, court);

  return {
    anchorDate: anchor.toISOString(),
    expiresRaw: expires.toISOString(),
    deadline: deadline.toISOString(),
    label: '48 ชั่วโมง (นำตัวไปศาล)',
  };
}

/**
 * calculateDetention — Provincial court detention rounds.
 * Rounds: 12 days each. Max 4 or 7 rounds based on penalty.
 */
export function calculateDetention(anchorDate, maxPenaltyYears, holidays = []) {
  const rule = maxPenaltyYears > 10
    ? DETENTION_RULES.PROVINCIAL_HIGH
    : DETENTION_RULES.PROVINCIAL_MID;

  const rounds = [];
  let currentStart = new Date(anchorDate);

  for (let i = 1; i <= rule.maxRounds; i++) {
    const end = addDays(currentStart, rule.daysPerRound);
    const deadline = getNextWorkingDay(end, holidays);

    rounds.push({
      round: i,
      label: `ผัดฟ้องครั้งที่ ${i}`,
      startDate: currentStart.toISOString(),
      endDate: deadline.toISOString(),
      daysPerRound: rule.daysPerRound,
      status: 'pending',
    });

    currentStart = deadline;
  }

  return {
    rule: rule.label,
    maxRounds: rule.maxRounds,
    daysPerRound: rule.daysPerRound,
    totalMaxDays: rule.maxRounds * rule.daysPerRound,
    rounds,
  };
}

/**
 * calculateMunicipalDetention — Municipal court (ศาลแขวง) 5 rounds x 6 days.
 */
export function calculateMunicipalDetention(anchorDate, holidays = []) {
  const rule = DETENTION_RULES.MUNICIPAL;
  const rounds = [];
  let currentStart = new Date(anchorDate);

  for (let i = 1; i <= rule.maxRounds; i++) {
    const end = addDays(currentStart, rule.daysPerRound);
    const deadline = getNextWorkingDay(end, holidays);

    rounds.push({
      round: i,
      label: `ผัดฟ้องครั้งที่ ${i}`,
      startDate: currentStart.toISOString(),
      endDate: deadline.toISOString(),
      daysPerRound: rule.daysPerRound,
      status: 'pending',
    });

    currentStart = deadline;
  }

  return {
    rule: rule.label,
    maxRounds: rule.maxRounds,
    daysPerRound: rule.daysPerRound,
    totalMaxDays: rule.maxRounds * rule.daysPerRound,
    rounds,
  };
}

/**
 * calculateJuvenile — Juvenile court detention.
 * ≤5 years: 2 rounds x 15 days. >5 years: 4 rounds x 15 days.
 */
export function calculateJuvenile(chargeDate, maxPenaltyYears, holidays = []) {
  const rule = maxPenaltyYears <= 5
    ? DETENTION_RULES.JUVENILE_LOW
    : DETENTION_RULES.JUVENILE_HIGH;

  const rounds = [];
  let currentStart = new Date(chargeDate);

  // First: 24 hours to bring to court
  const courtDeadline = addHours(currentStart, 24);

  // Then: 30 days investigation summary
  const summaryDeadline = addDays(currentStart, 30);

  for (let i = 1; i <= rule.maxRounds; i++) {
    const start = i === 1 ? new Date(chargeDate) : rounds[i - 2]?.endDate ? new Date(rounds[i - 2].endDate) : currentStart;
    const end = addDays(start, rule.daysPerRound);
    const deadline = getNextWorkingDay(end, holidays);

    rounds.push({
      round: i,
      label: `ผัดฟ้องครั้งที่ ${i}`,
      startDate: start.toISOString(),
      endDate: deadline.toISOString(),
      daysPerRound: rule.daysPerRound,
      status: 'pending',
    });
  }

  return {
    rule: rule.label,
    maxRounds: rule.maxRounds,
    daysPerRound: rule.daysPerRound,
    courtDeadline: courtDeadline.toISOString(),
    summaryDeadline: summaryDeadline.toISOString(),
    rounds,
  };
}

/**
 * calculateBailDeadline — Bail +6 months.
 */
export function calculateBailDeadline(bailDate) {
  const deadline = addMonths(new Date(bailDate), 6);
  return {
    bailDate: new Date(bailDate).toISOString(),
    deadline: deadline.toISOString(),
    label: 'ครบกำหนดประกัน (6 เดือน)',
  };
}

/**
 * getWarnings — Check deadlines and return warning items.
 * Warns 3 days before each deadline.
 */
export function getWarnings(rounds, now = new Date()) {
  const warnings = [];
  const threeDays = 3 * 24 * 60 * 60 * 1000;

  for (const round of rounds) {
    const deadline = new Date(round.endDate);
    const diff = deadline.getTime() - now.getTime();

    if (diff < 0) {
      warnings.push({
        level: 'danger',
        message: `⚠️ ${round.label} — เลยกำหนดแล้ว!`,
        round,
      });
    } else if (diff <= threeDays) {
      const daysLeft = Math.ceil(diff / (24 * 60 * 60 * 1000));
      warnings.push({
        level: 'warning',
        message: `⏰ ${round.label} — เหลืออีก ${daysLeft} วัน`,
        round,
      });
    }
  }

  return warnings;
}
