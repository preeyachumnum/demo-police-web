import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SettingsOrganization from './pages/settings/SettingsOrganization';
import SettingsCourts from './pages/settings/SettingsCourts';
import SettingsProsecutors from './pages/settings/SettingsProsecutors';
import SettingsAgencies from './pages/settings/SettingsAgencies';
import SettingsCharges from './pages/settings/SettingsCharges';
import CaseNew from './pages/case/CaseNew';
import CaseDashboard from './pages/case/CaseDashboard';

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Home / Dashboard */}
        <Route path="/" element={<Home />} />

        {/* Phase 0: Settings */}
        <Route path="/settings/organization" element={<SettingsOrganization />} />
        <Route path="/settings/courts" element={<SettingsCourts />} />
        <Route path="/settings/prosecutors" element={<SettingsProsecutors />} />
        <Route path="/settings/agencies" element={<SettingsAgencies />} />
        <Route path="/settings/charges" element={<SettingsCharges />} />

        {/* Phase 1: Create case */}
        <Route path="/case/new" element={<CaseNew />} />

        {/* Phase 2-11: Case management */}
        <Route path="/case/:id/*" element={<CaseDashboard />} />

        {/* Witness external form (Sprint 3) */}
        {/* <Route path="/witness/:token" element={<WitnessForm />} /> */}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
