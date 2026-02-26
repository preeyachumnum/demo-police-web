import { useState } from 'react'
import { CaseProvider, useCase } from './context/CaseContext'
import MainFlow from './components/MainFlow'

const Header = () => {
  const { state, saveDraft } = useCase();
  return (
    <header className="header justify-between">
      <h1 style={{color: 'var(--primary-dark)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          Police Web Document System
      </h1>
      {state.step > 1 && state.step < 7 && (
        <span style={{ fontSize: '0.875rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
          ✅ บันทึกอัตโนมัติ
        </span>
      )}
    </header>
  );
};

function App() {
  return (
    <div className="app-container">
      <CaseProvider>
        <Header />
        <MainFlow />
      </CaseProvider>
    </div>
  )
}

export default App
