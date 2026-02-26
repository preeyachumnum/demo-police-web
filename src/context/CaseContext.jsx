import React, { createContext, useContext, useState, useEffect } from 'react';

const CaseContext = createContext();

const initialState = {
  step: 1, // 1 to 7
  caseInfo: {
    offenseType: '',
    chargeDetails: '',
    damages: ''
  },
  suspects: [
    { id: 1, name: '', status: '', isEscape: false }
  ],
  caseStage: '', // 'complaint', 'investigation', 'warrant', 'summary'
  externalAgencies: {
    bank: false,
    telecom: false,
    forensic: false
  },
  arrestDate: null,
  chargeDate: null,
};

export const CaseProvider = ({ children }) => {
  // Load initial state from sessionStorage if exists
  const [state, setState] = useState(() => {
    const saved = sessionStorage.getItem('policeWebState');
    if (saved) return JSON.parse(saved);
    return initialState;
  });

  // Save to sessionStorage and localStorage on state change
  useEffect(() => {
    sessionStorage.setItem('policeWebState', JSON.stringify(state));
    
    // Auto-save draft if user is currently filling out the form
    if (state.step > 1 && state.step < 7) {
      const draft = { ...state, savedAt: new Date().toISOString() };
      localStorage.setItem('policeWebDraft', JSON.stringify(draft));
    }
  }, [state]);

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setState(prev => ({ ...prev, step: Math.min(prev.step + 1, 7) }));
  const prevStep = () => setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  
  const resetData = () => {
    sessionStorage.removeItem('policeWebState');
    localStorage.removeItem('policeWebDraft');
    setState(initialState);
  };

  const saveDraft = () => {
    const draft = { ...state, savedAt: new Date().toISOString() };
    localStorage.setItem('policeWebDraft', JSON.stringify(draft));
    alert('บันทึกแบบร่างสำเร็จ (ข้อมูลจะถูกเก็บไว้ในเครื่องของคุณ)');
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('policeWebDraft');
    if (draft) {
      const parsed = JSON.parse(draft);
      // Remove savedAt so it doesn't pollute the active state if not needed, or just let it be overridden
      setState(parsed);
    }
  };

  const deleteDraft = () => {
    if(window.confirm('คุณต้องการลบข้อมูลแบบร่างที่บันทึกไว้ใช่หรือไม่?')) {
      localStorage.removeItem('policeWebDraft');
      // Trigger a storage event manually if needed, or just let the components read it on mount
      return true;
    }
    return false;
  };

  return (
    <CaseContext.Provider value={{ state, updateState, nextStep, prevStep, resetData, saveDraft, loadDraft, deleteDraft }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => useContext(CaseContext);
