import React, { useEffect } from 'react';
import { useParams, useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import { useCase } from '../../context/CaseContext';
import { CASE_TYPE_LABELS, SUSPECT_STATUS_LABELS } from '../../lib/constants';
import { getTrackInfo } from '../../utils/rules/trackRules';
import { checkReadiness } from '../../utils/rules/readinessRules';
import { getRequiredDocuments, getDocumentsByCategory } from '../../utils/rules/documentRules';
import StatusBadge from '../../components/shared/StatusBadge';
import CaseCharges from './CaseCharges';
import SuspectStatus from './SuspectStatus';
import {
  FileText, Users, Scale, Package, Building, Hash,
  ClipboardList, Briefcase, FolderCheck, LayoutDashboard,
  AlertCircle, CheckCircle2, Clock
} from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear() + 543;
  return `${dd}/${mm}/${yy}`;
};

const CaseDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCase, loadCase } = useCase();

  useEffect(() => {
    if (!currentCase || currentCase.id !== id) {
      const found = loadCase(id);
      if (!found) {
        navigate('/');
      }
    }
  }, [id, currentCase, loadCase, navigate]);

  if (!currentCase) {
    return <div className="page-content"><p>กำลังโหลดคดี...</p></div>;
  }

  const track = currentCase.track ? getTrackInfo(currentCase.track) : null;
  const readiness = checkReadiness(currentCase);
  const docs = getRequiredDocuments(currentCase);
  const docGroups = getDocumentsByCategory(docs);
  const maxPenalty = Math.max(0, ...(currentCase.charges || []).map(c => c.maxPenaltyYears || 0));

  const basePath = `/case/${id}`;
  const navItems = [
    { to: basePath, icon: LayoutDashboard, label: 'ภาพรวม', end: true },
    { to: `${basePath}/charges`, icon: Scale, label: 'ตั้งข้อหา' },
    { to: `${basePath}/suspect-status`, icon: Users, label: 'สถานะผู้ต้องหา' },
    // Sprint 3+:
    // { to: 'people', icon: Users, label: 'คนในคดี' },
    // { to: 'properties', icon: Package, label: 'ทรัพย์/ของกลาง' },
    // { to: 'agencies', icon: Building, label: 'หน่วยนอก' },
    // { to: 'case-number', icon: Hash, label: 'เลขคดี' },
    // { to: 'summary', icon: ClipboardList, label: 'สรุปสำนวน' },
    // { to: 'prosecutor', icon: Briefcase, label: 'อัยการ' },
    // { to: 'final', icon: FolderCheck, label: 'Final Pack' },
  ];

  return (
    <div className="page-content">
      {/* Case Header */}
      <div className="case-header-card">
        <div className="case-header-top">
          <div>
            <h2 className="case-title">
              {currentCase.caseNumber || currentCase.tempId}
            </h2>
            <p className="text-muted">
              {CASE_TYPE_LABELS[currentCase.caseType] || currentCase.caseType}
              {currentCase.incidentDate && ` • ${formatDate(currentCase.incidentDate)}`}
            </p>
          </div>
          <div className="case-badges">
            {track && (
              <StatusBadge variant={track.color}>{track.emoji} {track.label}</StatusBadge>
            )}
            {currentCase.suspectStatus && (
              <StatusBadge variant="neutral">
                {SUSPECT_STATUS_LABELS[currentCase.suspectStatus]}
              </StatusBadge>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="case-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${readiness.progress}%` }}
            />
          </div>
          <span className="progress-label">
            ความพร้อม {readiness.progress}% ({readiness.completedCount}/{readiness.totalRequired})
          </span>
        </div>

        {currentCase.charges?.length > 0 && (
          <p className="case-charge-summary">
            <Scale size={14} /> {currentCase.charges.map(c => c.name).join(', ')}
            {maxPenalty > 0 && ` • โทษสูงสุด ${maxPenalty} ปี`}
          </p>
        )}
      </div>

      {/* Sub-navigation tabs */}
      <div className="case-tabs">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `case-tab ${isActive ? 'active' : ''}`}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Sub-routes */}
      <Routes>
        <Route index element={
          <CaseOverview
            currentCase={currentCase}
            readiness={readiness}
            docGroups={docGroups}
            track={track}
          />
        } />
        <Route path="charges" element={<CaseCharges />} />
        <Route path="suspect-status" element={<SuspectStatus />} />
      </Routes>
    </div>
  );
};

// --- Overview sub-component ---
const CaseOverview = ({ currentCase, readiness, docGroups, track }) => {
  return (
    <div className="case-overview">
      {/* Warnings & Missing */}
      {readiness.missing.length > 0 && (
        <div className="alert-box warning">
          <strong><AlertCircle size={16} /> ส่วนที่ยังขาด</strong>
          <ul className="missing-list">
            {readiness.missing.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      {/* Track info */}
      {track && (
        <div className="section-card">
          <h3 className="section-title">{track.emoji} Track: {track.label}</h3>
          <p className="text-muted">{track.description}</p>
        </div>
      )}

      {/* Document Checklist */}
      <div className="section-card">
        <h3 className="section-title"><FileText size={18} /> เอกสารที่ต้องทำ</h3>
        {Object.entries(docGroups).map(([cat, group]) => (
          <div key={cat} className="doc-group">
            <h4 className="doc-group-title">{group.label}</h4>
            <ul className="doc-list">
              {group.docs.map(doc => (
                <li key={doc.id} className="doc-item">
                  <span className={`doc-status ${doc.status}`}>
                    {doc.status === 'pending' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                  </span>
                  <span className="doc-name">{doc.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Case summary */}
      {currentCase.summary && (
        <div className="section-card">
          <h3 className="section-title">สรุปเรื่อง</h3>
          <p>{currentCase.summary}</p>
        </div>
      )}
    </div>
  );
};

export default CaseDashboard;
