// ============================================================
// Data Access Layer — localStorage-based persistence
// ============================================================

const STORE_KEY = 'policeWeb_';

// --- Generic CRUD ---

function getCollection(name) {
  const raw = localStorage.getItem(STORE_KEY + name);
  return raw ? JSON.parse(raw) : [];
}

function setCollection(name, data) {
  localStorage.setItem(STORE_KEY + name, JSON.stringify(data));
}

export function getAll(collection) {
  return getCollection(collection);
}

export function getById(collection, id) {
  return getCollection(collection).find(item => item.id === id) || null;
}

export function create(collection, item) {
  const items = getCollection(collection);
  const newItem = {
    ...item,
    id: item.id || crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(newItem);
  setCollection(collection, items);
  return newItem;
}

export function update(collection, id, updates) {
  const items = getCollection(collection);
  const idx = items.findIndex(item => item.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
  setCollection(collection, items);
  return items[idx];
}

export function remove(collection, id) {
  const items = getCollection(collection);
  const filtered = items.filter(item => item.id !== id);
  setCollection(collection, filtered);
  return filtered;
}

// --- Settings (singleton, not array) ---

export function getSettings(key) {
  const raw = localStorage.getItem(STORE_KEY + 'settings_' + key);
  return raw ? JSON.parse(raw) : null;
}

export function saveSettings(key, data) {
  localStorage.setItem(STORE_KEY + 'settings_' + key, JSON.stringify({
    ...data,
    updatedAt: new Date().toISOString(),
  }));
}

// --- Case-specific helpers ---

export function generateCaseId() {
  const now = new Date();
  const y = now.getFullYear() + 543; // พ.ศ.
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DRAFT-${y}${m}${d}-${rand}`;
}

// --- Seed data loader ---

export function initSeedDataIfNeeded(seedData) {
  const initialized = localStorage.getItem(STORE_KEY + 'initialized');
  if (initialized) return;

  if (seedData.chargeTemplates) {
    setCollection('chargeTemplates', seedData.chargeTemplates);
  }
  if (seedData.holidays) {
    setCollection('holidays', seedData.holidays);
  }

  localStorage.setItem(STORE_KEY + 'initialized', 'true');
}

// --- Export all cases for backup ---

export function exportAllData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORE_KEY)) {
      data[key.replace(STORE_KEY, '')] = JSON.parse(localStorage.getItem(key));
    }
  }
  return data;
}

export function clearAllData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORE_KEY)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}
