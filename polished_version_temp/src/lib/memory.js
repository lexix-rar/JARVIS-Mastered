/**
 * Memory Management System for Jarvis
 * Handles storage of persistent context and user facts.
 */

const CONTEXT_KEY = 'jarvis_persistent_context';
const FACTS_KEY = 'jarvis_facts';

export const getPersistentContext = () => {
  return localStorage.getItem(CONTEXT_KEY) || '';
};

export const saveContext = (contextString) => {
  localStorage.setItem(CONTEXT_KEY, contextString);
};

export const getFacts = () => {
  const stored = localStorage.getItem(FACTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addFact = (fact) => {
  const facts = getFacts();
  if (!facts.includes(fact)) {
    facts.push(fact);
    localStorage.setItem(FACTS_KEY, JSON.stringify(facts));
  }
};

export const clearMemory = () => {
  localStorage.removeItem(CONTEXT_KEY);
  localStorage.removeItem(FACTS_KEY);
};

// Helper to format the context for the system prompt
export const buildSystemContext = () => {
  const context = getPersistentContext();
  const facts = getFacts();

  let systemInjection = '';

  if (context) {
    systemInjection += `\nPREVIOUS CONTEXT SUMMARY:\n${context}\n`;
  }

  if (facts.length > 0) {
    systemInjection += `\nKNOWN FACTS:\n${facts.map(f => `- ${f}`).join('\n')}\n`;
  }

  return systemInjection;
};
