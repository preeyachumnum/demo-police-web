import React from 'react';
import { useCase } from '../../context/CaseContext';
import { SUSPECT_STATUSES, SUSPECT_STATUS_LABELS } from '../../lib/constants';
import { determineTrack, getTrackInfo } from '../../utils/rules/trackRules';
import { getRequiredDocuments } from '../../utils/rules/documentRules';
import StatusBadge from '../../components/shared/StatusBadge';
import { Users, ArrowRight, CheckCircle2 } from 'lucide-react';

const statusDescriptions = {
  [SUSPECT_STATUSES.DETENTION]: 'ผู้ต้องหาถูกจับกุมและจะนำฝากขัง → เปิด Track ฝากขัง/ผัดฟ้อง',
  [SUSPECT_STATUSES.BAIL]: 'ผู้ต้องหาได้รับการประกันตัว → เปิด Track ประกัน 6 เดือน',
  [SUSPECT_STATUSES.CHARGE_RELEASE]: 'แจ้งข้อหาแล้วปล่อยตัว → เอกสารปล่อยตัว + ประกัน',
  [SUSPECT_STATUSES.CHARGE_DETAIN]: 'แจ้งข้อหาแล้วนำฝากขัง → เปิด Track ฝากขัง',
  [SUSPECT_STATUSES.NOT_CAUGHT]: 'ไม่ได้ตัวผู้ต้องหา → ออกหมายเรียก → หมายจับ',
  [SUSPECT_STATUSES.UNKNOWN]: 'ไม่รู้ตัวผู้กระทำผิด → ออกหมายเรียก → สืบสวน',
  [SUSPECT_STATUSES.ORAL_PROSECUTION]: 'ยื่นฟ้องวาจาต่อศาล → เอกสารฟ้องวาจา',
  [SUSPECT_STATUSES.REHABILITATION]: 'ส่งเข้าสถานฟื้นฟู (คดียาเสพติด)',
  [SUSPECT_STATUSES.OTHER]: 'สถานะอื่นๆ ที่ไม่เข้ากับหมวดข้างต้น',
};

const SuspectStatus = () => {
  const { currentCase, updateSuspectStatus, updateCase } = useCase();
  
  if (!currentCase) return null;

  const handleSelect = (status) => {
    updateSuspectStatus(status);

    // Auto-determine track
    const track = determineTrack(status);
    updateCase({ track });
  };

  const currentStatus = currentCase.suspectStatus;

  return (
    <div className="case-sub-page">
      <h3 className="section-title"><Users size={18} /> สถานะผู้ต้องหา (Phase 3)</h3>
      <p className="text-muted mb-4">เลือกสถานะ → ระบบจะกำหนด Track + เพิ่มเอกสารที่ต้องทำอัตโนมัติ</p>

      <div className="status-grid">
        {Object.entries(SUSPECT_STATUS_LABELS).map(([value, label]) => {
          const isSelected = currentStatus === value;
          const track = determineTrack(value);
          const trackInfo = track ? getTrackInfo(track) : null;

          return (
            <button
              key={value}
              className={`status-card ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelect(value)}
            >
              <div className="status-card-header">
                <span className="status-card-label">{label}</span>
                {isSelected && <CheckCircle2 size={18} className="status-check" />}
              </div>
              <p className="status-card-desc">{statusDescriptions[value]}</p>
              {trackInfo && (
                <StatusBadge variant={trackInfo.color} size="sm">
                  {trackInfo.emoji} {trackInfo.label}
                </StatusBadge>
              )}
            </button>
          );
        })}
      </div>

      {currentStatus && (
        <div className="section-card mt-6">
          <h4 className="sub-section-title">
            ผลจากการเลือก "{SUSPECT_STATUS_LABELS[currentStatus]}"
          </h4>
          {currentCase.track && (
            <p>
              <ArrowRight size={14} /> Track: {getTrackInfo(currentCase.track).emoji}{' '}
              <strong>{getTrackInfo(currentCase.track).label}</strong>
            </p>
          )}
          <p className="text-muted mt-4">
            เอกสารที่เพิ่มเข้ามา: {getRequiredDocuments(currentCase).length} รายการ
          </p>
        </div>
      )}
    </div>
  );
};

export default SuspectStatus;
