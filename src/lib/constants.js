// ============================================================
// Constants & Enums for Police Web Document System
// ============================================================

// --- Case Types ---
export const CASE_TYPES = {
  CRIMINAL: 'criminal',
  TRAFFIC: 'traffic',
  INQUEST: 'inquest', // ชันสูตร
};
export const CASE_TYPE_LABELS = {
  [CASE_TYPES.CRIMINAL]: 'อาญา',
  [CASE_TYPES.TRAFFIC]: 'จราจร',
  [CASE_TYPES.INQUEST]: 'ชันสูตรพลิกศพ',
};

// --- Offense Categories (for Rule Engine) ---
export const OFFENSE_CATEGORIES = {
  DRUG: 'drug',
  FRAUD: 'fraud',
  FIREARM: 'firearm',
  E_CIGARETTE: 'e_cigarette',
  GENERAL: 'general',
};

// --- Suspect Statuses (9 สถานะ) ---
export const SUSPECT_STATUSES = {
  DETENTION: 'detention',           // ผัดฟ้องฝากขัง
  BAIL: 'bail',                     // ประกันตัว
  CHARGE_RELEASE: 'charge_release', // แจ้งข้อหาปล่อยตัว
  CHARGE_DETAIN: 'charge_detain',   // แจ้งข้อหาฝากขัง
  NOT_CAUGHT: 'not_caught',         // ไม่ได้ตัว
  UNKNOWN: 'unknown',               // ไม่รู้ตัว
  ORAL_PROSECUTION: 'oral_pros',    // ฟ้องวาจา
  REHABILITATION: 'rehabilitation', // ส่งฟื้นฟู
  OTHER: 'other',                   // อื่นๆ
};
export const SUSPECT_STATUS_LABELS = {
  [SUSPECT_STATUSES.DETENTION]: 'ผัดฟ้องฝากขัง',
  [SUSPECT_STATUSES.BAIL]: 'ประกันตัว',
  [SUSPECT_STATUSES.CHARGE_RELEASE]: 'แจ้งข้อหาปล่อยตัว',
  [SUSPECT_STATUSES.CHARGE_DETAIN]: 'แจ้งข้อหาฝากขัง',
  [SUSPECT_STATUSES.NOT_CAUGHT]: 'ไม่ได้ตัว',
  [SUSPECT_STATUSES.UNKNOWN]: 'ไม่รู้ตัว',
  [SUSPECT_STATUSES.ORAL_PROSECUTION]: 'ฟ้องวาจา',
  [SUSPECT_STATUSES.REHABILITATION]: 'ส่งฟื้นฟู',
  [SUSPECT_STATUSES.OTHER]: 'อื่นๆ',
};

// --- Plea (คำให้การ) ---
export const PLEAS = {
  CONFESS: 'confess',   // รับสารภาพ
  DENY: 'deny',         // ปฏิเสธ
};
export const PLEA_LABELS = {
  [PLEAS.CONFESS]: 'รับสารภาพ',
  [PLEAS.DENY]: 'ปฏิเสธ',
};

// --- Court Types ---
export const COURT_TYPES = {
  PROVINCIAL: 'provincial',     // ศาลจังหวัด
  MUNICIPAL: 'municipal',       // ศาลแขวง
  JUVENILE: 'juvenile',         // ศาลเยาวชนและครอบครัว
  TAX: 'tax',                   // ศาลภาษีอากรกลาง
  OTHER: 'other',
};
export const COURT_TYPE_LABELS = {
  [COURT_TYPES.PROVINCIAL]: 'ศาลจังหวัด',
  [COURT_TYPES.MUNICIPAL]: 'ศาลแขวง',
  [COURT_TYPES.JUVENILE]: 'ศาลเยาวชนและครอบครัว',
  [COURT_TYPES.TAX]: 'ศาลภาษีอากรกลาง',
  [COURT_TYPES.OTHER]: 'อื่นๆ',
};

// --- Detention Rules ---
export const DETENTION_RULES = {
  // ศาลจังหวัด — โทษ >10 ปี
  PROVINCIAL_HIGH: { maxRounds: 7, daysPerRound: 12, label: 'ศาลจังหวัด (โทษ >10 ปี)' },
  // ศาลจังหวัด — โทษ 3-10 ปี หรือปรับ >60,000
  PROVINCIAL_MID: { maxRounds: 4, daysPerRound: 12, label: 'ศาลจังหวัด (โทษ 3-10 ปี)' },
  // ศาลแขวง
  MUNICIPAL: { maxRounds: 5, daysPerRound: 6, label: 'ศาลแขวง (ผัดฟ้อง)' },
  // ศาลเยาวชน — โทษ ≤5 ปี
  JUVENILE_LOW: { maxRounds: 2, daysPerRound: 15, label: 'ศาลเยาวชน (โทษ ≤5 ปี)' },
  // ศาลเยาวชน — โทษ >5 ปี
  JUVENILE_HIGH: { maxRounds: 4, daysPerRound: 15, label: 'ศาลเยาวชน (โทษ >5 ปี)' },
};

// --- Tracks ---
export const TRACKS = {
  DETENTION: 'detention',   // 🔴 จับกุม/ฝากขัง
  BAIL: 'bail',             // 🟡 ประกันตัว
  SUMMONS: 'summons',       // 🔵 หมายเรียก → หมายจับ
  JUVENILE: 'juvenile',     // 🟣 ศาลเยาวชน
};
export const TRACK_LABELS = {
  [TRACKS.DETENTION]: '🔴 จับกุม/ฝากขัง',
  [TRACKS.BAIL]: '🟡 ประกันตัว',
  [TRACKS.SUMMONS]: '🔵 หมายเรียก/หมายจับ',
  [TRACKS.JUVENILE]: '🟣 ศาลเยาวชน',
};

// --- Document Statuses ---
export const DOC_STATUSES = {
  PENDING: 'pending',       // ยังไม่ได้ทำ
  DRAFT: 'draft',           // ร่าง (ยังไม่มีเลขคดี)
  READY: 'ready',           // พร้อม (มีเลขคดีแล้ว)
  SIGNED: 'signed',         // ลงนามแล้ว
  EXPORTED: 'exported',     // Export แล้ว
};

// --- External Agency Task Statuses ---
export const AGENCY_TASK_STATUSES = {
  REQUESTED: 'requested',   // ขอแล้ว
  RECEIVED: 'received',     // ได้รับแล้ว
  ATTACHED: 'attached',     // แนบเข้าแฟ้มแล้ว
};
export const AGENCY_TASK_STATUS_LABELS = {
  [AGENCY_TASK_STATUSES.REQUESTED]: 'ขอแล้ว',
  [AGENCY_TASK_STATUSES.RECEIVED]: 'ได้รับแล้ว',
  [AGENCY_TASK_STATUSES.ATTACHED]: 'แนบเข้าแฟ้มแล้ว',
};

// --- External Agency Types ---
export const AGENCY_TYPES = {
  DRUG_LAB: 'drug_lab',               // ที่ส่งตรวจยา
  FIREARM_LAB: 'firearm_lab',         // ตรวจปืน
  FIREARM_REGISTRY: 'firearm_reg',    // นายทะเบียนปืน
  CUSTOMS: 'customs',                 // ศุลกากร
  FORENSIC: 'forensic',               // นิติเวช
  BANK: 'bank',                       // ธนาคาร
  TELECOM: 'telecom',                 // โทรคมนาคม
};
export const AGENCY_TYPE_LABELS = {
  [AGENCY_TYPES.DRUG_LAB]: 'สถานที่ส่งตรวจยาเสพติด',
  [AGENCY_TYPES.FIREARM_LAB]: 'สถานที่ตรวจอาวุธปืน',
  [AGENCY_TYPES.FIREARM_REGISTRY]: 'นายทะเบียนอาวุธปืน',
  [AGENCY_TYPES.CUSTOMS]: 'ศุลกากร',
  [AGENCY_TYPES.FORENSIC]: 'นิติเวช',
  [AGENCY_TYPES.BANK]: 'ธนาคาร',
  [AGENCY_TYPES.TELECOM]: 'ผู้ให้บริการโทรคมนาคม',
};

// --- Roles ---
export const ROLES = {
  VICTIM: 'victim',               // ผู้เสียหาย/ผู้กล่าวหา
  ARREST_TEAM: 'arrest_team',     // เจ้าหน้าที่ชุดจับกุม
  WITNESS: 'witness',             // พยาน
  INVESTIGATOR: 'investigator',   // พนักงานสอบสวน
};
export const ROLE_LABELS = {
  [ROLES.VICTIM]: 'ผู้เสียหาย / ผู้กล่าวหา',
  [ROLES.ARREST_TEAM]: 'เจ้าหน้าที่ชุดจับกุม',
  [ROLES.WITNESS]: 'พยาน',
  [ROLES.INVESTIGATOR]: 'พนักงานสอบสวน',
};

// --- Case Outcomes (ผลคดี) ---
export const CASE_OUTCOMES = {
  INVESTIGATING: 'investigating',
  PROSECUTE: 'prosecute',
  NOT_PROSECUTE: 'not_prosecute',
  SUSPEND: 'suspend',
  OTHER: 'other',
};
export const CASE_OUTCOME_LABELS = {
  [CASE_OUTCOMES.INVESTIGATING]: 'อยู่ระหว่างสอบสวน',
  [CASE_OUTCOMES.PROSECUTE]: 'สั่งฟ้อง',
  [CASE_OUTCOMES.NOT_PROSECUTE]: 'ไม่ฟ้อง',
  [CASE_OUTCOMES.SUSPEND]: 'งดสอบสวน',
  [CASE_OUTCOMES.OTHER]: 'อื่นๆ',
};

// --- Property Types (บัญชีทรัพย์) ---
export const PROPERTY_USES = {
  EVIDENCE: 'evidence',             // บัญชีของกลาง
  DAMAGED: 'damaged',               // ทรัพย์ถูกประทุษร้าย
  RECOVERED: 'recovered',           // ได้คืน
  NOT_RECOVERED: 'not_recovered',   // ไม่ได้คืน
  FIRE_DAMAGED: 'fire_damaged',     // ถูกเพลิงไหม้
};
export const PROPERTY_USE_LABELS = {
  [PROPERTY_USES.EVIDENCE]: 'บัญชีของกลาง',
  [PROPERTY_USES.DAMAGED]: 'ทรัพย์ถูกประทุษร้าย',
  [PROPERTY_USES.RECOVERED]: 'ได้คืน',
  [PROPERTY_USES.NOT_RECOVERED]: 'ไม่ได้คืน',
  [PROPERTY_USES.FIRE_DAMAGED]: 'ถูกเพลิงไหม้',
};

// --- Summons defaults ---
export const SUMMONS_DEFAULTS = {
  IN_AREA_DAYS: 7,
  OUT_AREA_DAYS: 15,
};
