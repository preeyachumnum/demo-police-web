import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import {
  Home, Settings, Building2, Scale, Briefcase, Building,
  FileText, FolderPlus, ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { canAccess } = useRole();
  const location = useLocation();

  const isSettingsActive = location.pathname.startsWith('/settings');

  const navItems = [
    { to: '/', icon: Home, label: 'หน้าหลัก', always: true },
  ];

  const settingsItems = [
    { to: '/settings/organization', icon: Building2, label: 'ตั้งค่าหน่วยงาน' },
    { to: '/settings/courts', icon: Scale, label: 'ศาล' },
    { to: '/settings/prosecutors', icon: Briefcase, label: 'อัยการ' },
    { to: '/settings/agencies', icon: Building, label: 'หน่วยนอก' },
    { to: '/settings/charges', icon: FileText, label: 'ข้อหาสำเร็จรูป' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        {/* Main nav */}
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Create new case */}
        {canAccess('createCase') && (
          <NavLink
            to="/case/new"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <FolderPlus size={20} />
            <span>สร้างคดีใหม่</span>
          </NavLink>
        )}

        {/* Settings section */}
        {canAccess('manageSettings') && (
          <>
            <div className="sidebar-section-title">
              <Settings size={16} />
              <span>ตั้งค่าระบบ (Phase 0)</span>
            </div>
            {settingsItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link sub ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                <ChevronRight size={14} className="sidebar-arrow" />
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
