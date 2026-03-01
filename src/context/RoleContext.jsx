import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES } from '../lib/constants';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('policeWeb_currentRole') || ROLES.INVESTIGATOR;
  });

  useEffect(() => {
    localStorage.setItem('policeWeb_currentRole', currentRole);
  }, [currentRole]);

  // Permission matrix
  const permissions = {
    [ROLES.VICTIM]: {
      createCase: true,
      editOwnData: true,
      editProperties: true,
      attachEvidence: true,
      confirmCharge: false,
      issueCaseNumber: false,
      selectTrack: false,
      exportOwn: true,
      exportAll: false,
      manageSettings: false,
    },
    [ROLES.ARREST_TEAM]: {
      createCase: true,
      editArrestRecord: true,
      editProperties: true,
      attachEvidence: true,
      confirmCharge: false,
      issueCaseNumber: false,
      selectTrack: false,
      exportOwn: true,
      exportAll: false,
      manageSettings: false,
    },
    [ROLES.WITNESS]: {
      createCase: false,
      editOwnStatement: true,
      confirmCharge: false,
      issueCaseNumber: false,
      selectTrack: false,
      exportOwn: false,
      exportAll: false,
      manageSettings: false,
    },
    [ROLES.INVESTIGATOR]: {
      createCase: true,
      editAll: true,
      editOwnData: true,
      editProperties: true,
      editArrestRecord: true,
      attachEvidence: true,
      confirmCharge: true,
      issueCaseNumber: true,
      selectTrack: true,
      exportOwn: true,
      exportAll: true,
      manageSettings: true,
    },
  };

  const canAccess = (action) => {
    const rolePerms = permissions[currentRole];
    return rolePerms ? !!rolePerms[action] : false;
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, canAccess }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
