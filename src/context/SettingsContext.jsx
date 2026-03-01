import React, { createContext, useContext, useState, useEffect } from 'react';
import * as db from '../lib/db';
import seedData from '../data/seed.json';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Initialize seed data on first load
  useEffect(() => {
    db.initSeedDataIfNeeded(seedData);
  }, []);

  // --- Organization ---
  const [organization, setOrganization] = useState(() => {
    return db.getSettings('organization') || {
      stationName: '',
      address: '',
      phone: '',
      documentNumber: '',
      bureau: '',          // บก./บช.
      commanderName: '',   // ผกก.
      deputyName: '',      // รอง ผกก.
    };
  });

  const saveOrganization = (data) => {
    db.saveSettings('organization', data);
    setOrganization(data);
  };

  // --- Courts ---
  const [courts, setCourts] = useState(() => db.getAll('courts'));
  const saveCourt = (court) => {
    if (court.id) {
      db.update('courts', court.id, court);
    } else {
      db.create('courts', court);
    }
    setCourts(db.getAll('courts'));
  };
  const deleteCourt = (id) => {
    db.remove('courts', id);
    setCourts(db.getAll('courts'));
  };

  // --- Prosecutors ---
  const [prosecutors, setProsecutors] = useState(() => db.getAll('prosecutors'));
  const saveProsecutor = (item) => {
    if (item.id) {
      db.update('prosecutors', item.id, item);
    } else {
      db.create('prosecutors', item);
    }
    setProsecutors(db.getAll('prosecutors'));
  };
  const deleteProsecutor = (id) => {
    db.remove('prosecutors', id);
    setProsecutors(db.getAll('prosecutors'));
  };

  // --- External Agencies ---
  const [agencies, setAgencies] = useState(() => db.getAll('agencies'));
  const saveAgency = (item) => {
    if (item.id) {
      db.update('agencies', item.id, item);
    } else {
      db.create('agencies', item);
    }
    setAgencies(db.getAll('agencies'));
  };
  const deleteAgency = (id) => {
    db.remove('agencies', id);
    setAgencies(db.getAll('agencies'));
  };

  // --- Charge Templates ---
  const [chargeTemplates, setChargeTemplates] = useState(() => db.getAll('chargeTemplates'));
  const saveChargeTemplate = (item) => {
    if (item.id) {
      db.update('chargeTemplates', item.id, item);
    } else {
      db.create('chargeTemplates', item);
    }
    setChargeTemplates(db.getAll('chargeTemplates'));
  };
  const deleteChargeTemplate = (id) => {
    db.remove('chargeTemplates', id);
    setChargeTemplates(db.getAll('chargeTemplates'));
  };

  // --- Holidays ---
  const [holidays, setHolidays] = useState(() => db.getAll('holidays'));

  return (
    <SettingsContext.Provider value={{
      organization, saveOrganization,
      courts, saveCourt, deleteCourt,
      prosecutors, saveProsecutor, deleteProsecutor,
      agencies, saveAgency, deleteAgency,
      chargeTemplates, saveChargeTemplate, deleteChargeTemplate,
      holidays,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
