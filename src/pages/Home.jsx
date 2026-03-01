import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useSettings } from '../context/SettingsContext';
import { useCase } from '../context/CaseContext';
import { ROLES, ROLE_LABELS, CASE_TYPE_LABELS, SUSPECT_STATUS_LABELS } from '../lib/constants';
import { getTrackInfo } from '../utils/rules/trackRules';
import StatusBadge from '../components/shared/StatusBadge';
import { ShieldAlert, Settings, FolderPlus, User, ChevronRight, Trash2 } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { currentRole, setCurrentRole, canAccess } = useRole();
  const { organization } = useSettings();
  const { caseList, deleteCase } = useCase();

  const isSetupDone = organization && organization.stationName;

  return (
    <div className="page-content">
      {/* Hero */}
      <div className="hero-card">
        <div className="hero-icon">
          <ShieldAlert size={48} />
        </div>
        <h2>ระบบจัดการเอกสารสำนวนคดี</h2>
        <p className="text-muted">
          Police Web Document System v2
        </p>
        {isSetupDone && (
          <p className="hero-station">{organization.stationName}</p>
        )}
      </div>

      {/* Role Selector */}
      <div className="section-card">
        <h3 className="section-title">
          <User size={20} /> เลือกบทบาทผู้ใช้งาน
        </h3>
        <div className="role-grid">
          {Object.entries(ROLE_LABELS).map(([role, label]) => (
            <button
              key={role}
              className={`role-card ${currentRole === role ? 'active' : ''}`}
              onClick={() => setCurrentRole(role)}
            >
              <span className="role-card-label">{label}</span>
              {currentRole === role && <span className="role-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-card">
        <h3 className="section-title">เมนูด่วน</h3>

        {!isSetupDone && canAccess('manageSettings') && (
          <div className="alert-box warning">
            <strong>⚠️ ยังไม่ได้ตั้งค่าระบบ</strong>
            <p>กรุณาตั้งค่าหน่วยงาน ศาล และอัยการ ก่อนเริ่มสร้างคดี</p>
            <button
              className="btn btn-primary mt-4"
              onClick={() => navigate('/settings/organization')}
            >
              <Settings size={18} /> ไปตั้งค่าหน่วยงาน
            </button>
          </div>
        )}

        {isSetupDone && canAccess('createCase') && (
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate('/case/new')}
          >
            <FolderPlus size={18} /> สร้างคดีใหม่
          </button>
        )}
      </div>

      {/* Case List */}
      {caseList.length > 0 && (
        <div className="section-card">
          <h3 className="section-title">คดีที่มีอยู่ ({caseList.length})</h3>
          <div className="case-list">
            {caseList.map(c => {
              const track = c.track ? getTrackInfo(c.track) : null;
              return (
                <div key={c.id} className="case-list-item" onClick={() => navigate(`/case/${c.id}`)}>
                  <div className="case-list-info">
                    <strong>{c.caseNumber || c.tempId}</strong>
                    <p className="text-muted">
                      {CASE_TYPE_LABELS[c.caseType] || c.caseType}
                      {c.incidentDate && ` • ${c.incidentDate}`}
                    </p>
                    {c.charges?.length > 0 && (
                      <p className="case-list-charges">{c.charges.map(ch => ch.name).join(', ')}</p>
                    )}
                  </div>
                  <div className="case-list-actions">
                    {track && (
                      <StatusBadge variant={track.color} size="sm">{track.emoji}</StatusBadge>
                    )}
                    {c.suspectStatus && (
                      <StatusBadge variant="neutral" size="sm">
                        {SUSPECT_STATUS_LABELS[c.suspectStatus]}
                      </StatusBadge>
                    )}
                    <ChevronRight size={16} className="text-muted" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
