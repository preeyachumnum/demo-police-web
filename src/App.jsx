import React from 'react'
import { RoleProvider } from './context/RoleContext'
import { SettingsProvider } from './context/SettingsContext'
import { CaseProvider } from './context/CaseContext'
import AppRouter from './router'

function App() {
  return (
    <RoleProvider>
      <SettingsProvider>
        <CaseProvider>
          <AppRouter />
        </CaseProvider>
      </SettingsProvider>
    </RoleProvider>
  )
}

export default App
