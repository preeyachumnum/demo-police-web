// ============================================================
// Track Rules — Determine which track a case falls into
// ============================================================
import { SUSPECT_STATUSES, TRACKS, COURT_TYPES } from '../../lib/constants';

/**
 * determineTrack — Based on suspect status + court type + plea.
 */
export function determineTrack(suspectStatus, courtType = null, suspectAge = null) {
  // Juvenile always overrides if age < 18
  if (suspectAge !== null && suspectAge < 18) {
    return TRACKS.JUVENILE;
  }
  if (courtType === COURT_TYPES.JUVENILE) {
    return TRACKS.JUVENILE;
  }

  switch (suspectStatus) {
    case SUSPECT_STATUSES.DETENTION:
    case SUSPECT_STATUSES.CHARGE_DETAIN:
      return TRACKS.DETENTION;

    case SUSPECT_STATUSES.BAIL:
    case SUSPECT_STATUSES.CHARGE_RELEASE:
      return TRACKS.BAIL;

    case SUSPECT_STATUSES.NOT_CAUGHT:
    case SUSPECT_STATUSES.UNKNOWN:
      return TRACKS.SUMMONS;

    case SUSPECT_STATUSES.ORAL_PROSECUTION:
    case SUSPECT_STATUSES.REHABILITATION:
    case SUSPECT_STATUSES.OTHER:
    default:
      return null; // No specific track
  }
}

/**
 * getTrackInfo — Return display info for a track.
 */
export function getTrackInfo(track) {
  const infos = {
    [TRACKS.DETENTION]: {
      emoji: '🔴',
      label: 'จับกุม / ฝากขัง',
      color: 'danger',
      description: 'บันทึกจับกุม → รับตัว → 48 ชม. → เอกสารเร่งด่วน → ผัดฟ้อง',
    },
    [TRACKS.BAIL]: {
      emoji: '🟡',
      label: 'ประกันตัว',
      color: 'warning',
      description: 'สัญญาประกัน → ปล่อยตัว → ครบกำหนด 6 เดือน',
    },
    [TRACKS.SUMMONS]: {
      emoji: '🔵',
      label: 'หมายเรียก / หมายจับ',
      color: 'info',
      description: 'หมายเรียกครั้ง 1 → ครั้ง 2 → ขอหมายจับ',
    },
    [TRACKS.JUVENILE]: {
      emoji: '🟣',
      label: 'ศาลเยาวชน',
      color: 'info',
      description: '24 ชม. พาไปศาล → 30 วันสรุป → ผัดฟ้อง 15 วัน/ครั้ง',
    },
  };
  return infos[track] || { emoji: '⚪', label: 'ไม่ระบุ', color: 'neutral', description: '' };
}
