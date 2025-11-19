
import { GenerationHistoryItem } from '../types';

const STORAGE_KEY = 'robo_ai_history';

export const getHistory = (): GenerationHistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveHistoryItem = (item: GenerationHistoryItem): GenerationHistoryItem[] => {
  const currentHistory = getHistory();
  const updatedHistory = [item, ...currentHistory];
  
  return saveToStorage(updatedHistory);
};

export const deleteHistoryItem = (id: string): GenerationHistoryItem[] => {
  const currentHistory = getHistory();
  const updatedHistory = currentHistory.filter(item => item.id !== id);
  
  return saveToStorage(updatedHistory);
};

export const clearHistory = (): GenerationHistoryItem[] => {
    localStorage.removeItem(STORAGE_KEY);
    return [];
};

const saveToStorage = (history: GenerationHistoryItem[]): GenerationHistoryItem[] => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return history;
    } catch (e) {
        // Handle QuotaExceededError by removing oldest items
        if (history.length > 1) {
            // Remove the last item (oldest) and try again
            const trimmedHistory = history.slice(0, -1);
            return saveToStorage(trimmedHistory);
        } else {
            console.error("Storage full, cannot save even a single item.", e);
            // If we can't save even one, we might just return what we have in memory or throw
            return history; 
        }
    }
};
