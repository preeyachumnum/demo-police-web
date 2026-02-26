import React from 'react';
import { useCase } from '../context/CaseContext';
import Screen1_Welcome from './Screen1_Welcome';
import Screen2_CaseInfo from './Screen2_CaseInfo';
import Screen3_Suspects from './Screen3_Suspects';
import Screen4_CaseStage from './Screen4_CaseStage';
import Screen5_Dashboard from './Screen5_Dashboard';
import Screen6_DocsGen from './Screen6_DocsGen';
import Screen7_Download from './Screen7_Download';

const MainFlow = () => {
  const { state } = useCase();

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {state.step === 1 && <Screen1_Welcome />}
      {state.step === 2 && <Screen2_CaseInfo />}
      {state.step === 3 && <Screen3_Suspects />}
      {state.step === 4 && <Screen4_CaseStage />}
      {state.step === 5 && <Screen5_Dashboard />}
      {state.step === 6 && <Screen6_DocsGen />}
      {state.step === 7 && <Screen7_Download />}
    </main>
  );
};

export default MainFlow;
