import React, { createContext, useContext, useState, useCallback } from 'react';
import * as db from '../lib/db';

const CaseContext = createContext();

// Default empty case structure
const emptyCaseData = () => ({
  id: null,
  caseNumber: null,       // เลขคดีจริง (Phase 6)
  tempId: null,           // DRAFT-XXXXXX
  caseType: '',           // criminal | traffic | inquest
  incidentDate: '',
  incidentTime: '',
  incidentLocation: '',
  summary: '',
  status: 'draft',        // draft | active | closed

  // Phase 2: ข้อหา
  charges: [],            // [{ name, legalText, laws:[], maxPenaltyYears, category }]

  // Phase 3: สถานะผู้ต้องหา
  suspectStatus: '',      // from SUSPECT_STATUSES enum
  track: null,            // detention | bail | summons | juvenile

  // Phase 4: คนในคดี
  complainants: [],       // [{ id, ...personFields, statement, evidence:[] }]
  suspects: [],           // [{ id, ...personFields, plea, interviewDate }]
  witnesses: [],          // [{ id, token, status, ...personFields, statement }]

  // Phase 5: ทรัพย์/หลักฐาน
  properties: [],         // [{ id, item, qty, price, date, seizedFrom, use }]
  crimeScene: null,       // { description, photos:[] }

  // Phase 6: เลขคดี
  caseNumberData: null,   // { number, date, time }

  // Phase 7: Track data
  trackData: {
    detention: null,      // { arrestDate, anchorDate, courtId, rounds:[] }
    bail: null,           // { bailDate, deadline, bondAmount }
    summons: null,        // { rounds:[], warrantRequested }
    juvenile: null,       // { courtDate, summaryDeadline, rounds:[] }
  },

  // Phase 8: หน่วยนอก
  agencyTasks: [],        // [{ id, agencyId, type, status, requestDate, receiveDate }]

  // Phase 9: สรุปสำนวน
  investigation: null,    // { report, outcome, notes }

  // Phase 10: อัยการ
  prosecutor: null,       // { prosecutorId, documentNumber, sendDate }

  // Document checklist
  documents: [],          // [{ id, name, status, type, generatedAt }]

  // Suggested court
  suggestedCourtType: null,

  // Metadata
  createdAt: null,
  updatedAt: null,
});

export const CaseProvider = ({ children }) => {
  const [currentCase, setCurrentCase] = useState(null);
  const [caseList, setCaseList] = useState(() => db.getAll('cases'));

  // --- Case CRUD ---
  const createCase = useCallback((caseData) => {
    const tempId = db.generateCaseId();
    const newCase = {
      ...emptyCaseData(),
      ...caseData,
      tempId,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const saved = db.create('cases', newCase);
    setCaseList(db.getAll('cases'));
    setCurrentCase(saved);
    return saved;
  }, []);

  const loadCase = useCallback((id) => {
    const found = db.getById('cases', id);
    if (found) {
      setCurrentCase(found);
    }
    return found;
  }, []);

  const updateCase = useCallback((updates) => {
    if (!currentCase) return null;
    const updated = db.update('cases', currentCase.id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    setCurrentCase(updated);
    setCaseList(db.getAll('cases'));
    return updated;
  }, [currentCase]);

  const deleteCase = useCallback((id) => {
    db.remove('cases', id);
    if (currentCase?.id === id) setCurrentCase(null);
    setCaseList(db.getAll('cases'));
  }, [currentCase]);

  const refreshCaseList = useCallback(() => {
    setCaseList(db.getAll('cases'));
  }, []);

  // --- Case sub-data helpers ---
  const addCharge = useCallback((charge) => {
    if (!currentCase) return;
    const charges = [...(currentCase.charges || []), { ...charge, id: crypto.randomUUID() }];
    updateCase({ charges });
  }, [currentCase, updateCase]);

  const removeCharge = useCallback((chargeId) => {
    if (!currentCase) return;
    const charges = (currentCase.charges || []).filter(c => c.id !== chargeId);
    updateCase({ charges });
  }, [currentCase, updateCase]);

  const updateSuspectStatus = useCallback((status) => {
    if (!currentCase) return;
    updateCase({ suspectStatus: status });
  }, [currentCase, updateCase]);

  const updateTrack = useCallback((track) => {
    if (!currentCase) return;
    updateCase({ track });
  }, [currentCase, updateCase]);

  const updateDocuments = useCallback((documents) => {
    if (!currentCase) return;
    updateCase({ documents });
  }, [currentCase, updateCase]);

  return (
    <CaseContext.Provider value={{
      currentCase,
      caseList,
      createCase,
      loadCase,
      updateCase,
      deleteCase,
      refreshCaseList,
      addCharge,
      removeCharge,
      updateSuspectStatus,
      updateTrack,
      updateDocuments,
    }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => useContext(CaseContext);
